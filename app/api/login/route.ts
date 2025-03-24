import { NextResponse } from 'next/server';
import { PlayFabClient } from 'playfab-sdk';

// 環境変数からタイトルIDを取得
const titleId = process.env.PLAYFAB_TITLE_ID;

// PlayFabの初期化
PlayFabClient.settings.titleId = titleId || '';

export async function POST(request: Request) {
  const { deviceId } = await request.json();

  if (!titleId) {
    return NextResponse.json({ message: 'PlayFab Title ID is not set' }, { status: 400 });
  }

  if (!deviceId) {
    return NextResponse.json({ message: 'Device ID is required' }, { status: 400 });
  }

  const requestPayload = {
    TitleId: titleId,
    CustomId: deviceId, // deviceIdをCustomIdとして使用
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
      return resolve(NextResponse.json({ message: 'Login successful', result }, { status: 200 }));
    });
  });
}
