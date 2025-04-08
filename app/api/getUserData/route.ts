import { NextResponse } from 'next/server';
import { PlayFabAdmin } from 'playfab-sdk';
import { cookies } from 'next/headers';

// PlayFabの設定
PlayFabAdmin.settings.titleId = process.env.PLAYFAB_TITLE_ID!;
PlayFabAdmin.settings.developerSecretKey = process.env.PLAYFAB_DEV_SECRET!;

// PlayFabのレスポンス型定義
interface PlayFabResult {
  data: {
    Data?: {
      [key: string]: {
        Value: string;
      };
    };
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keys = searchParams.get("keys")?.split(",") || [];

    // クッキーからPlayFabIDを取得
    const cookieStore = await cookies();
    const playFabId = cookieStore.get('playfab_id')?.value;

    if (!playFabId) {
      return NextResponse.json(
        { error: "PlayFab ID not found in cookies" },
        { status: 400 }
      );
    }

    const result = await new Promise<PlayFabResult>((resolve, reject) => {
      PlayFabAdmin.GetUserData(
        {
          PlayFabId: playFabId,
          Keys: keys,
        },
        (error, result) => {
          if (error) {
            console.error("PlayFab error:", error);
            reject(error);
          } else {
            resolve(result as PlayFabResult);
          }
        }
      );
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // クッキーからPlayFabIDを取得
    const cookieStore = await cookies();
    const playFabId = cookieStore.get('playfab_id')?.value;

    if (!playFabId) {
      return NextResponse.json(
        { error: "PlayFab ID not found in cookies" },
        { status: 400 }
      );
    }

    // リクエストボディからキーの配列を取得
    const { keys } = await request.json();
    
    if (!keys || !Array.isArray(keys)) {
      return NextResponse.json(
        { error: "Keys array is required" },
        { status: 400 }
      );
    }

    const result = await new Promise<PlayFabResult>((resolve, reject) => {
      PlayFabAdmin.GetUserData(
        {
          PlayFabId: playFabId,
          Keys: keys,
        },
        (error, result) => {
          if (error) {
            console.error("PlayFab error:", error);
            reject(error);
          } else {
            resolve(result as PlayFabResult);
          }
        }
      );
    });

    // データを整形して返す
    const formattedData: { [key: string]: any } = {};
    if (result.data?.Data) {
      Object.entries(result.data.Data).forEach(([key, value]) => {
        try {
          formattedData[key] = JSON.parse(value.Value);
        } catch {
          formattedData[key] = value.Value;
        }
      });
    }

    return NextResponse.json({
      code: 200,
      status: "OK",
      data: formattedData
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 