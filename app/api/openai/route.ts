import OpenAI from "openai";
import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import { dbAdmin, verifyTokenOrThrow } from "@/app/lib/firebaseAdmin";
import * as admin from "firebase-admin";
import { SYSTEM_PROMPT, MODE_SPECIFIC_INSTRUCTIONS, StorageMode } from "./prompts";

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

    if (!Object.keys(MODE_SPECIFIC_INSTRUCTIONS).includes(mode)) {
      return NextResponse.json({ error: "無効なモードが指定されました" }, { status: 400 });
    }

    // -------------------------
    // 3. hangerモードの場合のFirebaseからの画像情報取得
    // -------------------------
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
        
        console.log("Found rack:", { name: rackData.name, imageUrl: rackData.imageUrl });
      } catch (error) {
        console.error("Error fetching rack:", error);
        return NextResponse.json({ error: "ハンガーラック情報の取得に失敗しました" }, { status: 500 });
      }
    }

    // -------------------------
    // 4. プロンプトの組み立て
    // -------------------------
    const systemMessage = {
      role: "system",
      content: SYSTEM_PROMPT
    };

    // ユーザー入力のpromptと追加指示を結合
    const combinedPrompt = `${prompt}\n\n${MODE_SPECIFIC_INSTRUCTIONS[mode as StorageMode]}`;
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
              text: combinedPrompt,
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
    let validatedResponse;
    try {
      console.log("Attempting to parse response message:", responseMessage);
      const parsedResponse = JSON.parse(responseMessage);
      
      // 必須フィールドの存在確認
      if (!parsedResponse.organizationDirection) {
        console.error("Missing organizationDirection field");
        throw new Error("Missing organizationDirection field");
      }
      if (!Array.isArray(parsedResponse.steps) || parsedResponse.steps.length === 0) {
        console.error("Invalid or empty steps array");
        throw new Error("Invalid or empty steps array");
      }
      
      // ステップ数のバリデーション
      const stepsCount = parsedResponse.steps.length;
      console.log("Number of steps:", stepsCount);
      if (stepsCount < 5) {
        console.error("Too few steps:", stepsCount);
        throw new Error("生成されたステップ数が少なすぎます");
      }
      
      // 各ステップの完全性を確認
      parsedResponse.steps.forEach((step: any, index: number) => {
        const requiredFields = ['stepNumber', 'dungeonName', 'title', 'description', 'hint'];
        const missingFields = requiredFields.filter(field => !step[field]);
        if (missingFields.length > 0) {
          console.error(`Step ${index + 1} is missing fields:`, missingFields);
          throw new Error(`Step ${index + 1} is missing required fields: ${missingFields.join(', ')}`);
        }
      });

      // JSONの再構築（余分な空白や改行を削除）
      validatedResponse = JSON.stringify(parsedResponse, null, 2);
      console.log("Validated response:", validatedResponse);
    } catch (parseError) {
      console.error("JSON validation error:", parseError);
      return NextResponse.json({ 
        error: "生成されたJSONが不完全です", 
        details: parseError instanceof Error ? parseError.message : "Unknown error",
        rawResponse: responseMessage
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

        // ハンガーラックのstepsGeneratedをtrueに更新
        console.log("Updating stepsGenerated to true for rack:", rackId);
        await dbAdmin
          .collection(`users/${uid}/racks`)
          .doc(rackId)
          .update({
            stepsGenerated: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        console.log("Successfully updated stepsGenerated to true");

        // キャッシュの無効化
        try {
          const targetPagePath = `/castle/hanger/${rackId}`;
          revalidatePath(targetPagePath, 'page');
          console.log(`Revalidated page path: ${targetPagePath}`);
        } catch (revalidateError) {
          console.error('Error during revalidation:', revalidateError);
        }

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
