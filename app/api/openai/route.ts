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
    let rackData;
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

        rackData = rackDoc.data();
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
・「organizationDirection」には、以下の2つの要素を**バランスよく組み合わせた構成**にしてください：

①【現状分析】画像をもとに、**服の種類・量・状態・詰まり具合・季節の混在状況**などを、現実的かつ客観的に分析してください。たとえば「パーカー3枚、Tシャツ5枚、ワンピース3枚などがぎゅうぎゅうにかかっている」など。

②【整理収納の方向性アドバイス】その分析をもとに、「RPGの世界観を反映したモチベーションの上がるアドバイス」を行ってください。ユーザーを冒険者に見立て、「装備庫」「魔道具」などのRPG風の言葉を使いながら、やる気を引き出すトーンでアドバイスしてください（例：「冒険の装備があふれる装備庫。まずは季節ごとに分類し、魔法のクローゼットへ進化しよう！」）。

・文章量は**全体で150字程度**までOKです。
・RPG感と現実的な分析の両方があることを重視してください。
・organizationDirectionの前半では現状分析（事実）を、後半では冒険者への語りかけ口調でやる気が出るようなRPG風の整理アドバイスを記述してください。

※文章全体は、親しみやすく、やる気を引き出すトーンにしてください。
※すべての分析は【画像情報】をもとに正確に行ってください。

・「steps」には、【画像情報】を踏まえた整理収納ステップを*10〜15個生成することとし、**ステップ1は最も簡単な作業**から始め、徐々に難易度を上げること。
・すべてのステップは**1つ15分以内で完了できる内容**にすること。

【ステップ構成（難易度順）】
1. 要・不要の判断（ステップ1〜3）
   - 最初のステップ1では「一年以上着ていない服を5着手放す」など、**ごく簡単な行動からスタート**する。
   - 「一年以上着ていないものは基本捨てよう！」という考えを**ヒント**に必ず含める。
   - ハンガーラックに多くの服がかかっている（収納全体の80％以上目安）詰まっている場合、**服を減らすステップを多めに含める（ステップ1〜6程度まで）**

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

【ステップタイトル】
・ステップタイトルは楽しい魔法RPG風（例：「衣の森の序章」）に。

【追加指示】
・服の占有率が 30% 以下の場合は「服が少なめで整理しやすい」という前提で、手放すステップは1〜2個だけにする。
・服の占有率が 80% 以上の場合は「服が多すぎる」という前提で、手放すステップを5個以上盛り込む。
・80% 未満〜 30% 以上の場合は、その中間程度の手放し量にする。
 **服が収納スペースの80%以上**を占めている場合：「服が多い」と評価。
- **服が30%以下**なら：「服が少なめ」と評価。
- その間は「適量」とします。
※画像を見て「服が詰まっている印象」がある場合は、枚数が正確でなくとも**占有率80%以上**と判断してください。
特にハンガー同士の間隔が狭く、服同士が重なって見える場合は「服が多い」とみなしてください。

【ヒント表現に関する特別指示】
・すべてのヒント文は、**RPGの世界観に基づいた演出**を取り入れてください。
・ユーザーを「冒険者」、服やアイテムを「装備」「仲間」「魔道具」などに例え、**ユニークで楽しい比喩表現**を用いてください。
・例：Tシャツ →「日常の戦闘を支えた軽装の戦闘服」、使わないベルト →「かつて腰回りを守った守護具」など。
・とくに「要・不要の判断」ステップでは、**断捨離するべきアイテムを面白く表現**してください（例：「ほつれたマント＝旅の終わりを告げる布」）。
・ヒントの内容は**前向きかつモチベーションが上がる**ように書いてください。
・ユーザーが「ゲームを攻略しているような気分」になるような、**ファンタジックかつ親しみやすい口調**を意識してください。

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
  ]
}

【重要】
・必ず有効なJSON形式で出力すること
・各ステップの最後にカンマを付けること
・最後のステップの後にはカンマを付けないこと
・余計な文章やコメントは入れないこと
・必ずJSONの閉じカッコ（}）で終わること`;
        
        
        
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
    let messages;
    if (mode === "hanger" && rackData?.imageUrl) {
      messages = [
        systemMessage,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${prompt}\n\n${additionalInstructions}`,
            },
            {
              type: "image_url",
              image_url: {
                url: rackData.imageUrl,
              },
            },
          ],
        },
      ];
    } else {
      messages = [
        systemMessage,
        { role: "user", content: combinedPrompt },
      ];
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
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

    // JSONの完全性を確認
    let validatedResponse = responseMessage;
    try {
      const parsedResponse = JSON.parse(responseMessage);
      
      // 必須フィールドの存在確認
      if (!parsedResponse.organizationDirection) {
        throw new Error("Missing organizationDirection field");
      }
      if (!Array.isArray(parsedResponse.steps) || parsedResponse.steps.length === 0) {
        throw new Error("Invalid or empty steps array");
      }
      
      // 各ステップの完全性を確認
      parsedResponse.steps.forEach((step: any, index: number) => {
        const requiredFields = ['stepNumber', 'dungeonName', 'title', 'description', 'hint'];
        const missingFields = requiredFields.filter(field => !step[field]);
        if (missingFields.length > 0) {
          throw new Error(`Step ${index + 1} is missing required fields: ${missingFields.join(', ')}`);
        }
      });

      // JSONの再構築（余分な空白や改行を削除）
      validatedResponse = JSON.stringify(parsedResponse, null, 2);
    } catch (parseError) {
      console.error("JSON validation error:", parseError);
      return NextResponse.json({ 
        error: "生成されたJSONが不完全です", 
        details: parseError instanceof Error ? parseError.message : "Unknown error" 
      }, { status: 500 });
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
          content: validatedResponse,
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
    return NextResponse.json({ result: validatedResponse }, { status: 200 });
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
