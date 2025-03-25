import { NextResponse } from 'next/server';
import { PlayFabServer } from 'playfab-sdk';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // クッキーからセッションチケットを取得
    const cookieStore = await cookies();
    const rawSessionTicket = cookieStore.get('session_ticket')?.value;
    console.log('Raw session ticket from cookie:', rawSessionTicket);

    if (!rawSessionTicket) {
      return NextResponse.json({ error: 'Session ticket not found' }, { status: 400 });
    }

    // セッションチケットを二重デコード
    const decodedOnce = decodeURIComponent(rawSessionTicket);
    const sessionTicket = decodeURIComponent(decodedOnce);

    // PlayFabの設定
    const titleId = process.env.PLAYFAB_TITLE_ID;
    const secretKey = process.env.PLAYFAB_DEV_SECRET;

    if (!titleId || !secretKey) {
      throw new Error('PlayFab credentials are not set');
    }

    // PlayFabServerの初期化
    PlayFabServer.settings.titleId = titleId;
    PlayFabServer.settings.developerSecretKey = secretKey;

    // セッションチケットからPlayFabIDを抽出
    const playFabId = sessionTicket.split('-')[0];

    // PlayFabからステージクリアデータを取得
    const result = await new Promise((resolve, reject) => {
      PlayFabServer.GetUserData({
        PlayFabId: playFabId,
        Keys: ["stage1_cleared", "stage1_problems", "stage1_ideals", "stage2_cleared", "stage3_cleared", "stage4_cleared", "stage5_cleared", "stage6_cleared", "stage7_cleared", "stage8_cleared", "stage9_cleared", "stage10_cleared", "stage11_cleared", "stage11_feelings", "stage12_cleared", "stage13_cleared"]
      }, (error, result) => {
        if (error) {
          console.error("PlayFab error:", error)
          reject(error)
        } else {
          console.log("PlayFab GetUserData result:", result)
          resolve(result)
        }
      })
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error getting user data:", error);
    return NextResponse.json(
      { error: 'Failed to get user data' },
      { status: 500 }
    );
  }
} 