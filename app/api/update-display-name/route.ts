import { NextResponse } from 'next/server';
import { PlayFabClient } from 'playfab-sdk';

// 環境変数から設定を取得
const titleId = process.env.PLAYFAB_TITLE_ID;
const devSecret = process.env.PLAYFAB_DEV_SECRET;

if (!titleId || !devSecret) {
  throw new Error('Required PlayFab environment variables are not set');
}

// PlayFabの初期化
PlayFabClient.settings.titleId = titleId;
PlayFabClient.settings.productionUrl = `https://${titleId}.playfabapi.com`;

export async function POST(request: Request) {
  try {
    const { displayName } = await request.json();

    if (!displayName) {
      return NextResponse.json({ message: 'Display name is required' }, { status: 400 });
    }

    // セッションチケットをクッキーから取得
    const cookies = request.headers.get('cookie');
    if (!cookies) {
      return NextResponse.json({ message: 'No cookies found' }, { status: 401 });
    }

    let sessionTicket = cookies.split('session_ticket=')[1]?.split(';')[0];
    if (!sessionTicket) {
      return NextResponse.json({ message: 'Session ticket not found' }, { status: 401 });
    }

    // **URL デコードを行う**
    sessionTicket = decodeURIComponent(sessionTicket);
    console.log('Backend Session Ticket (Decoded):', sessionTicket);

    // **PlayFabClient.settings を any 型で上書きして sessionTicket を設定**
    (PlayFabClient.settings as any).sessionTicket = sessionTicket;

    // PlayFab API呼び出し（UpdateUserTitleDisplayName）
    return new Promise<NextResponse>((resolve) => {
      PlayFabClient.UpdateUserTitleDisplayName({
        DisplayName: displayName
      }, (error, result) => {
        if (error) {
          console.error('PlayFab UpdateUserTitleDisplayName error:', error);
          return resolve(NextResponse.json({
            message: 'Update failed',
            error: error.errorMessage || 'Unknown error occurred'
          }, { status: 400 }));
        }

        return resolve(NextResponse.json({
          message: 'Update successful',
          result
        }, { status: 200 }));
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}