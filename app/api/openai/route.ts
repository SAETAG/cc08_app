import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const { mode, prompt } = await request.json();

    // 基本プロンプトと追加指示を組み合わせる
    const systemMessage = {
      role: "system",
      content: "【基本プロンプト】あなたは「お片付けの妖精モーちゃん」です。親しみやすく、短い回答でユーザーにアドバイスを提供してください。",
    };

    let additionalInstructions = "";
    if (mode === "hanger") {
      additionalInstructions = "【ハンガーラック用追加指示】ハンガーラックの特性を活かしたファンタジックなおかたづけダンジョンを生成してください。";
    } else if (mode === "drawer") {
      additionalInstructions = "【引き出し用追加指示】引き出し収納の特徴を考慮した効率的なダンジョンデータを生成してください。";
    } else if (mode === "shelf") {
      additionalInstructions = "【棚用追加指示】棚のレイアウトや配置を反映した視覚的に魅力あるダンジョンデータを生成してください。";
    } else if (mode === "chat") {
      additionalInstructions = "【チャット用追加指示】ユーザーとの対話を自然に進め、必要な情報を順次収集してください。";
    }

    const messages = [
      systemMessage,
      { role: "system", content: additionalInstructions },
      { role: "user", content: prompt },
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseMessage = completion.data.choices[0].message?.content;

    return NextResponse.json({ result: responseMessage }, { status: 200 });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 