// app/api/generate/openai/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { dbAdmin, verifyTokenOrThrow } from "@/app/lib/firebaseAdmin";
import * as admin from "firebase-admin";

console.log("OpenAI API route initialized");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "設定されています" : "設定されていません");
console.log("OpenAI API Key Length:", process.env.OPENAI_API_KEY?.length);
console.log("OpenAI API Key Prefix:", process.env.OPENAI_API_KEY?.substring(0, 10));

export async function POST(request: Request) {
  console.log("Received POST request to /api/openai");
  
  try {
    // トークン検証
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      console.log("No authorization header found");
      return NextResponse.json({ error: "認証ヘッダーが必要です" }, { status: 401 });
    }
    
    console.log("Verifying token...");
    const uid = await verifyTokenOrThrow(authHeader);
    console.log("Token verified, user ID:", uid);

    // リクエストボディから mode, prompt, rackId を取得
    const { mode, prompt, rackId } = await request.json();
    console.log("Request body:", { mode, prompt, rackId });

    // modeが "hanger" の場合、Firebaseから対象のハンガーラック情報を取得する
    let imageDescription = "";
    if (mode === "hanger") {
      try {
        console.log("Fetching rack with ID:", rackId);
        
        // ユーザーごとのracksコレクションからデータを取得
        const rackDoc = await dbAdmin.collection(`users/${uid}/racks`).doc(rackId).get();
        console.log("Specific rack document:", {
          exists: rackDoc.exists,
          id: rackDoc.id,
          data: rackDoc.data()
        });
        
        if (!rackDoc.exists) {
          console.error("Rack not found for ID:", rackId);
          return NextResponse.json({ error: "指定されたハンガーラックが見つかりません" }, { status: 404 });
        }

        const rackData = rackDoc.data();
        if (!rackData) {
          console.error("Rack data is null for ID:", rackId);
          return NextResponse.json({ error: "ハンガーラックのデータが不正です" }, { status: 500 });
        }

        const imageUrl = rackData.imageUrl || "";
        const rackName = rackData.name || "Unknown Rack";
        console.log("Found rack:", { rackName, imageUrl });
        
        imageDescription = `画像情報: このハンガーラックの名前は "${rackName}" で、画像URLは "${imageUrl}" です。画像から受ける印象は、明るく洗練され、快適な空間を演出していると想定してください。`;
      } catch (error) {
        console.error("Error fetching rack:", error);
        return NextResponse.json(
          { error: "ハンガーラック情報の取得に失敗しました" },
          { status: 500 }
        );
      }
    }

    // 基本プロンプト（共通の役割・トーン設定）
    const systemMessage = {
      role: "system",
      content:
        "【基本プロンプト】あなたは「お片付けの妖精モーちゃん」です。親しみやすく、短い回答でユーザーにアドバイスを提供してください。",
    };

    // モードに応じた追加指示
    let additionalInstructions = "";
    if (mode === "hanger") {
      additionalInstructions =
`以下の条件に従って、JSON形式のみで出力してください。  
・全体の「整理収納の方向性」は、明るく快適な空間作りを目指した実践的なおかたづけ戦略とすること。  
・「steps」には10～30のステップを含め、ステップ1は最も簡単で、以降ステップが進むにつれて難易度が上がるように設定すること。  
・各ステップは以下の項目を持つものとする：  
  - stepNumber: 数値（1から順に増加）  
  - dungeonName: このステップに合わせた魔法RPG風のダンジョン名  
  - title: ミッションの内容を端的に示すタイトル  
  - description: ミッションの具体的な内容や手順の詳細  
  - hint: ミッション遂行に役立つヒント  
【画像情報】  
${imageDescription}
【出力フォーマット】  
{
  "organizationDirection": "string",
  "steps": [
    {
      "stepNumber": 1,
      "dungeonName": "string",
      "title": "string",
      "description": "string",
      "hint": "string"
    }
    // ...（10～30ステップ）
  ]
}

余計な文章やコメントは入れず、上記JSON構造のみを出力してください.`;
    } else if (mode === "drawer") {
      additionalInstructions =
        "【引き出し用追加指示】引き出し収納の特徴を考慮した効率的なダンジョンデータを生成してください。";
    } else if (mode === "shelf") {
      additionalInstructions =
        "【棚用追加指示】棚のレイアウトや配置を反映した視覚的に魅力あるダンジョンデータを生成してください。";
    } else if (mode === "chat") {
      additionalInstructions =
        "【チャット用追加指示】ユーザーとの対話を自然に進め、必要な情報を順次収集してください。";
    } else {
      additionalInstructions = "【注意】サポートされていないモードです。";
    }

    // ユーザーの入力promptと追加指示を結合
    const combinedPrompt = `${prompt}\n\n${additionalInstructions}`;

    // GPTに送信するメッセージ配列の構築
    const messages = [
      systemMessage,
      { role: "user", content: combinedPrompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1500,
    }).catch(error => {
      console.error("OpenAI API Error Details:", {
        status: error.status,
        code: error.code,
        type: error.type,
        message: error.message,
        response: error.response
      });
      if (error.status === 429) {
        throw new Error("OpenAIのAPIクォータを超過しました。管理者にお問い合わせください。");
      }
      throw error;
    });

    console.log("OpenAI Response:", completion);

    const responseMessage = completion.choices[0]?.message?.content;
    
    if (!responseMessage) {
      console.error("No content in OpenAI response");
      return NextResponse.json(
        { error: "OpenAIから有効なレスポンスが得られませんでした" },
        { status: 500 }
      );
    }

    // Firebaseに保存
    if (mode === "hanger" && responseMessage) {
      try {
        console.log("Attempting to save to Firebase...");
        // rackIdごとにadventuresを保存
        const adventureRef = dbAdmin.collection(`users/${uid}/racks/${rackId}/adventures`).doc();
        const saveData = {
          userId: uid,
          rackId: rackId,
          content: responseMessage,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        console.log("Saving data:", saveData);
        await adventureRef.set(saveData);
        console.log("Successfully saved to Firebase at path:", `users/${uid}/racks/${rackId}/adventures/${adventureRef.id}`);
      } catch (firebaseError) {
        console.error("Firebase save error:", firebaseError);
        return NextResponse.json(
          { error: "Firebaseへの保存に失敗しました" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ result: responseMessage }, { status: 200 });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("認証") ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
