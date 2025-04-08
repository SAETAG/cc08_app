// app/api/generate/openai/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { dbAdmin, verifyTokenOrThrow } from "@/app/lib/firebaseAdmin";
import * as admin from "firebase-admin";

console.log("OpenAI API route initialized");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    console.log("Received POST request to /api/generate/openai");
    
    // -------------------------
    // 1. トークン検証
    // -------------------------
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      console.error("No authorization header found");
      return NextResponse.json({ error: "認証ヘッダーが必要です" }, { status: 401 });
    }
    console.log("Verifying token...");
    const uid = await verifyTokenOrThrow(authHeader);
    console.log("Token verified, user ID:", uid);

    // -------------------------
    // 2. リクエストボディの取得
    // -------------------------
    const { mode, prompt, rackId } = await request.json();
    console.log("Request body:", { mode, prompt, rackId });

    // -------------------------
    // 3. hangerモードの場合のFirebaseからの画像情報取得
    // -------------------------
    let imageDescription = "";
    if (mode === "hanger") {
      try {
        console.log("Fetching rack with ID:", rackId);
        const rackDoc = await dbAdmin
          .collection(`users/${uid}/racks`)
          .doc(rackId)
          .get();

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
        
        imageDescription = `\n【ハンガーラック情報】\n・名前: "${rackName}"\n・画像URL: "${imageUrl}"\n・現在の状態: このハンガーラックの写真から、明るく洗練された快適な空間が演出されていると想定してください。`;
      } catch (error) {
        console.error("Error fetching rack:", error);
        return NextResponse.json({ error: "ハンガーラック情報の取得に失敗しました" }, { status: 500 });
      }
    }

    // -------------------------
    // 4. 基本プロンプトと追加指示の組み立て
    // -------------------------
    const systemMessage = {
      role: "system",
      content:
        "【基本プロンプト】あなたは「お片付けの妖精モーちゃん」です。親しみやすく、短い回答でユーザーにアドバイスを提供するプロフェッショナルです。あなたのアドバイスは、整理収納アドバイザー1級の理論と実践に基づいており、単なる片付けにとどまらず、クライアントのライフスタイルや価値観に寄り添い、「必要なものを必要なときに使える」環境を整えることを目的としています。まず第1の点では、「所有の意味を考える」ことから始まります。モノを持つ理由や、誰のためのモノなのかといった所有の目的を明確にすることで、整理の第一歩となります。続いて第2の点では、「モノの本質を知る」ことが求められます。モノの役割や使用頻度、さらには制作者の意図などを踏まえて、持ち続けるか手放すかを判断します。第3の点は、「整理の狙いを明確にする」ことです。これは、ただ片付けるのではなく、クライアントがどのような暮らしをしたいのか、その理想を明確にし、整理収納の目的を定める段階です。第4の点では、「適正量を設定する」ことに取り組みます。ライフスタイルや収納スペース、生活リズムなどに応じて、必要なモノの量を見極めます。これにより、モノの過剰な所有を防ぐことができます。次に第5の点では、「定位置を決める」ことに取り組みます。使用頻度や動線を考慮しながら、モノを使いやすい位置に配置することで、日々の使い勝手が向上します。そして第6の点では、「使いやすく収める」ことで、収納の利便性と見た目の美しさを両立させます。収納形態（棚・引き出し・箱など）の特性を活かし、使いやすさを重視します。第7の点は、「ラベリングする」ことです。定位置を明確に表示することで、誰が見てもモノの場所が分かるようになり、家族全体で収納が維持しやすくなります。",
    };

    // モードごとに追加指示を設定する（hangerモードの場合は画像情報も含む）
    let additionalInstructions = "";
    switch (mode) {
      case "hanger":
        additionalInstructions =
`以下の条件に従って、JSON形式のみで出力してください。

【条件】
・ハンガーラックに関するアドバイスのみ出力すること（棚・ボックスなど他の収納には触れない）。
・「organizationDirection」には、【画像情報】を踏まえた**現状分析**と、それをもとにした**整理収納の方向性**を記述すること（例：「ハンガーの量が多いね！物を減らして使いやすいクローゼットを目指そう」など）。
・「steps」は10〜15個とし、**ステップ1は最も簡単な作業**から始め、徐々に難易度を上げること。
・すべてのステップは**1つ15分以内で完了できる内容**にすること。

【ステップ構成（難易度順）】
1. 要・不要の判断（ステップ1〜3）
   - 最初のステップ1では「一年以上着ていない服を5着手放す」など、**ごく簡単な行動からスタート**する。
   - 「一年以上着ていないものは基本捨てよう！」という考えを**ヒント**に必ず含める。
   - ハンガーラックが明らかに詰まっている場合、**服を減らすステップを多めに含める（ステップ1〜6程度まで）**

2. 不要品の処分（ステップ4〜6）
   - 寄付・リサイクル・フリマアプリの活用など選択肢を提示してもよい。

3. 必要なもののグルーピング（ステップ7〜9）
   - 色別・用途別・季節別に分類など。

4. 収納（使用頻度別・動線に沿った収納）（ステップ10〜12）
   - よく使うものを手前に、季節外のものは奥に、など。

5. ラベリングや見直し体制の構築（ステップ13〜15）
   - 一時保留ゾーンの設置や、定期的な見直しリマインダーの作成など。

【画像情報】
${imageDescription}

【注意】
・ハンガーラックがすでに片付いている場合はステップ数を減らしてもよい。
・ステップタイトルは楽しい魔法RPG風（例：「衣の森の序章」）に。
・ヒントは、**実行のコツやモチベーションが上がる短文**とする。

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
    // ...（10～15ステップ）
  ]
}

余計な文章やコメントは入れず、上記JSON構造のみを出力してください.`;
        
        
        
        break;
      case "drawer":
        additionalInstructions =
          "【引き出し用追加指示】引き出し収納の特徴を考慮した効率的なダンジョンデータを生成してください。";
        break;
      case "shelf":
        additionalInstructions =
          "【棚用追加指示】棚のレイアウトや配置を反映した視覚的に魅力あるダンジョンデータを生成してください。";
        break;
      case "chat":
        additionalInstructions =
          "【チャット用追加指示】ユーザーとの対話を自然に進め、必要な情報を順次収集してください。";
        break;
      default:
        additionalInstructions = "【注意】サポートされていないモードです。";
    }

    // ユーザー入力のpromptと追加指示を結合
    const combinedPrompt = `${prompt}\n\n${additionalInstructions}`;
    console.log("Combined Prompt:", combinedPrompt);

    // -------------------------
    // 5. GPT API の呼び出し
    // -------------------------
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
      return NextResponse.json({ error: "OpenAIから有効なレスポンスが得られませんでした" }, { status: 500 });
    }

    // -------------------------
    // 6. 生成結果のFirebaseへの保存（hangerモードのみ）
    // -------------------------
    if (mode === "hanger") {
      try {
        console.log("Attempting to save generated adventure to Firebase...");
        const adventureRef = dbAdmin
          .collection(`users/${uid}/racks/${rackId}/adventures`)
          .doc();
        const saveData = {
          userId: uid,
          rackId: rackId,
          content: responseMessage,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        console.log("Saving data:", saveData);
        await adventureRef.set(saveData);
        console.log("Successfully saved to Firebase at:", `users/${uid}/racks/${rackId}/adventures/${adventureRef.id}`);
      } catch (firebaseError) {
        console.error("Firebase save error:", firebaseError);
        return NextResponse.json({ error: "Firebaseへの保存に失敗しました" }, { status: 500 });
      }
    }

    // -------------------------
    // 7. 結果の返却
    // -------------------------
    return NextResponse.json({ result: responseMessage }, { status: 200 });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("認証") ? 401 : 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
