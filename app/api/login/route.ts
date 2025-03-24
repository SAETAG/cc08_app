import { NextResponse } from 'next/server';
import { PlayFabClient } from 'playfab-sdk';

// 環境変数からタイトルIDを取得
const titleId = process.env.PLAYFAB_TITLE_ID;

// PlayFabの初期化
PlayFabClient.settings.titleId = titleId || '';

export async function POST(request: Request) {
  const { customId } = await request.json();

  if (!titleId) {
    return NextResponse.json({ message: 'PlayFab Title ID is not set' }, { status: 400 });
  }

  if (!customId) {
    return NextResponse.json({ message: 'Custom ID is required' }, { status: 400 });
  }

  const requestPayload = {
    TitleId: titleId,
    CustomId: customId,
    CreateAccount: true,
  };

  // PlayFab API呼び出し（匿名ログイン）
  return new Promise<NextResponse>((resolve, reject) => {
    PlayFabClient.LoginWithCustomID(requestPayload, (error, result) => {
      if (error) {
        return resolve(NextResponse.json({ 
          message: 'Login failed', 
          error: error.errorMessage || 'Unknown error occurred' 
        }, { status: 400 }));
      }

      // セッションチケットを取得
      const sessionTicket = result.data.SessionTicket;

      // セッションチケットをクッキーに設定
      const response = NextResponse.json({ 
        message: 'Login successful', 
        result,
        sessionTicket 
      }, { status: 200 });

      response.cookies.set('session_ticket', sessionTicket, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7日間
      });

      return resolve(response);
    });
  });
}
