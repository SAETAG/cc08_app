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

    // リクエストボディからアイテム名を取得
    const { itemName } = await request.json();
    if (!itemName) {
      return NextResponse.json({ message: 'Item name is required' }, { status: 400 });
    }

    // 現在のITEMリストを取得
    const currentItemsResult = await new Promise((resolve, reject) => {
      PlayFabServer.GetUserData({
        PlayFabId: playFabId,
        Keys: ["ITEM"]
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

    // 現在のITEMリストを取得（存在しない場合は空の配列）
    let currentItems = [];
    try {
      currentItems = JSON.parse((currentItemsResult as any).data.Data?.ITEM?.Value || "[]");
    } catch (error) {
      console.error("Error parsing current items:", error);
      currentItems = [];
    }

    // 新しいアイテムを追加（重複を防ぐ）
    if (!currentItems.includes(itemName)) {
      currentItems.push(itemName);
    }

    // ITEMリストを更新
    const updateResult = await new Promise((resolve, reject) => {
      PlayFabServer.UpdateUserData({
        PlayFabId: playFabId,
        Data: {
          ITEM: JSON.stringify(currentItems)
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
      message: 'Item update successful',
      items: currentItems,
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