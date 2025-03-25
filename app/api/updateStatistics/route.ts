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
    // クッキーからセッションチケットを取得
    const cookies = request.headers.get('cookie');
    if (!cookies) {
      return NextResponse.json({ message: 'セッションクッキーが見つかりません' }, { status: 401 });
    }
    
    let sessionTicket = cookies.split('session_ticket=')[1]?.split(';')[0];
    if (!sessionTicket) {
      return NextResponse.json({ message: 'セッションチケットが見つかりません' }, { status: 401 });
    }
    sessionTicket = decodeURIComponent(decodeURIComponent(sessionTicket));
    console.log('バックエンドセッションチケット（デコード済み）:', sessionTicket);

    // セッションチケットからPlayFabIdを取得
    const playFabId = sessionTicket.split('-')[0];
    if (!playFabId) {
      return NextResponse.json({ message: 'PlayFabIdの取得に失敗しました' }, { status: 400 });
    }

    // 加算するEXP（固定値: 50）
    const expIncrement = 50;

    // PlayFab UpdatePlayerStatistics API を呼び出す
    const requestData = {
      PlayFabId: playFabId,
      Statistics: [
        { StatisticName: "Experience", Value: expIncrement, Version: 0 },
        { StatisticName: "DayExperience", Value: expIncrement, Version: 0 },
        { StatisticName: "WeekExperience", Value: expIncrement, Version: 0 }
      ]
    };

    console.log("PlayFab UpdatePlayerStatistics APIを呼び出し中...", requestData);

    // まず現在の統計情報を取得
    const currentStats = await new Promise((resolve, reject) => {
      PlayFabServer.GetPlayerStatistics({
        PlayFabId: playFabId,
        StatisticNames: ["Experience", "DayExperience", "WeekExperience"]
      }, (error, result) => {
        if (error) {
          console.error("統計情報取得エラー:", error);
          reject(error);
        } else {
          resolve(result.data.Statistics || []);
        }
      });
    });

    console.log("現在の統計情報:", currentStats);

    // 統計情報を更新（加算モード）
    const updateStatsResult = await new Promise((resolve, reject) => {
      const updateRequest = {
        PlayFabId: playFabId,
        Statistics: [
          {
            StatisticName: "Experience",
            Value: ((currentStats as any[]).find(s => s.StatisticName === "Experience")?.Value || 0) + expIncrement
          },
          {
            StatisticName: "DayExperience",
            Value: ((currentStats as any[]).find(s => s.StatisticName === "DayExperience")?.Value || 0) + expIncrement
          },
          {
            StatisticName: "WeekExperience",
            Value: ((currentStats as any[]).find(s => s.StatisticName === "WeekExperience")?.Value || 0) + expIncrement
          }
        ]
      };

      console.log("更新リクエスト:", updateRequest);

      PlayFabServer.UpdatePlayerStatistics(updateRequest, (error, result) => {
        if (error) {
          console.error("PlayFab統計情報更新エラー:", {
            error,
            errorCode: error.errorCode,
            errorMessage: error.errorMessage,
            errorDetails: error.errorDetails
          });
          reject(error);
        } else {
          console.log("PlayFab統計情報更新成功:", {
            result,
            data: result.data
          });

          // 更新後の統計情報を取得
          PlayFabServer.GetPlayerStatistics({
            PlayFabId: playFabId,
            StatisticNames: ["Experience", "DayExperience", "WeekExperience"]
          }, (getError, getResult) => {
            if (getError) {
              console.error("更新後の統計情報取得エラー:", getError);
              resolve(result);
            } else {
              console.log("更新後の統計情報:", getResult.data);
              resolve({
                ...result,
                data: {
                  ...result.data,
                  updatedStatistics: getResult.data.Statistics
                }
              });
            }
          });
        }
      });
    });

    // 処理完了のログ出力
    console.log("API処理完了:", {
      playFabId,
      updateStatsResult
    });

    // レスポンスの返却
    return NextResponse.json({
      message: '統計情報の更新が完了しました',
      result: updateStatsResult,
      playFabId,
      statistics: updateStatsResult.data?.updatedStatistics || []
    }, { status: 200 });
  } catch (error) {
    console.error('サーバーエラーの詳細:', {
      name: error instanceof Error ? error.name : '不明',
      message: error instanceof Error ? error.message : '不明なエラーが発生しました',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({
      message: 'サーバー内部エラー',
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
} 