import { NextResponse } from 'next/server';
import { PlayFabServer } from 'playfab-sdk';

// 環境変数から設定を取得
const titleId = process.env.PLAYFAB_TITLE_ID;
const devSecret = process.env.PLAYFAB_DEV_SECRET;

if (!titleId || !devSecret) {
  throw new Error('Required PlayFab environment variables are not set');
}

// PlayFabの初期化
PlayFabServer.settings.titleId = titleId;
PlayFabServer.settings.developerSecretKey = devSecret;

export async function POST(request: Request) {
  try {
    // セッションチケットをクッキーから取得
    const cookies = request.headers.get('cookie');
    if (!cookies) {
      return NextResponse.json({ message: 'No cookies found' }, { status: 401 });
    }

    let sessionTicket = cookies.split('session_ticket=')[1]?.split(';')[0];
    if (!sessionTicket) {
      return NextResponse.json({ message: 'Session ticket not found' }, { status: 401 });
    }

    // URLデコードを行う
    sessionTicket = decodeURIComponent(decodeURIComponent(sessionTicket));
    console.log('Backend Session Ticket (Decoded):', sessionTicket);

    // セッションチケットからPlayFabIdを取得
    const playFabId = sessionTicket.split('-')[0];

    // 現在のEXP値を取得
    const currentExpResult = await new Promise((resolve, reject) => {
      PlayFabServer.GetUserData({
        PlayFabId: playFabId,
        Keys: ["EXP"]
      }, (error, result) => {
        if (error) {
          console.error("PlayFab GetUserData error:", error);
          reject(error);
        } else {
          console.log("PlayFab GetUserData success:", result);
          resolve(result);
        }
      });
    });

    // 現在のEXP値を取得（存在しない場合は0）
    const currentExp = parseInt((currentExpResult as any).data.Data?.EXP?.Value || "0", 10);
    const newExp = currentExp + 50; // 50EXPを加算

    // EXP値を更新
    const updateResult = await new Promise((resolve, reject) => {
      PlayFabServer.UpdateUserData({
        PlayFabId: playFabId,
        Data: {
          EXP: newExp.toString()
        }
      }, (error, result) => {
        if (error) {
          console.error("PlayFab UpdateUserData error:", error);
          reject(error);
        } else {
          console.log("PlayFab UpdateUserData success:", result);
          resolve(result);
        }
      });
    });

    return NextResponse.json({
      message: 'EXP update successful',
      newExp: newExp,
      result: updateResult
    }, { status: 200 });

  } catch (error) {
    console.error('Server error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 