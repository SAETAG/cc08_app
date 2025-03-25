import { NextResponse } from 'next/server';
import { PlayFabServer, PlayFabAdmin } from 'playfab-sdk';

// 環境変数から設定を取得
const titleId = process.env.PLAYFAB_TITLE_ID;
const devSecret = process.env.PLAYFAB_DEV_SECRET;

if (!titleId || !devSecret) {
  throw new Error('Required PlayFab environment variables are not set');
}

// PlayFabの初期化
PlayFabServer.settings.titleId = titleId;
PlayFabServer.settings.developerSecretKey = devSecret;
PlayFabAdmin.settings.titleId = titleId;
PlayFabAdmin.settings.developerSecretKey = devSecret;

export async function GET(request: Request) {
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
    sessionTicket = decodeURIComponent(sessionTicket);
    console.log('Backend Session Ticket (Decoded):', sessionTicket);

    // セッションチケットからPlayFabIdを取得
    const authResult = await new Promise((resolve, reject) => {
      PlayFabServer.AuthenticateSessionTicket({
        SessionTicket: sessionTicket
      }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    const playFabId = (authResult as any).data.UserInfo.PlayFabId;

    // PlayFabAdminを使用してユーザー情報を取得
    const userInfoResult = await new Promise((resolve, reject) => {
      PlayFabAdmin.GetUserAccountInfo({
        PlayFabId: playFabId
      }, (error, result) => {
        if (error) {
          console.error('PlayFab GetUserAccountInfo error:', error);
          reject(error);
        } else {
          console.log('PlayFab GetUserAccountInfo success:', result);
          resolve(result);
        }
      });
    });

    return NextResponse.json({
      message: 'User info retrieved successfully',
      userInfo: (userInfoResult as any).data.UserInfo
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