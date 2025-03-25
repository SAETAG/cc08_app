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

// 統計情報の型定義
interface Statistic {
  StatisticName: string;
  Value: number;
  Version?: number;
}

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

    // セッションチケットからPlayFabIdを取得
    const playFabId = sessionTicket.split('-')[0];
    if (!playFabId) {
      return NextResponse.json({ message: 'PlayFabIdの取得に失敗しました' }, { status: 400 });
    }

    // 加算するEXP（固定値: 50）
    const expIncrement = 50;

    // 1. 現在の統計情報を取得
    const currentStats = await new Promise<Statistic[]>((resolve, reject) => {
      PlayFabServer.GetPlayerStatistics({
        PlayFabId: playFabId,
        StatisticNames: ["Experience", "DayExperience", "WeekExperience"]
      }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.data.Statistics || []);
        }
      });
    });

    // 2. 統計情報を更新（加算モード）
    const updateRequest = {
      PlayFabId: playFabId,
      Statistics: [
        {
          StatisticName: "Experience",
          Value: (currentStats.find(s => s.StatisticName === "Experience")?.Value || 0) + expIncrement
        },
        {
          StatisticName: "DayExperience",
          Value: (currentStats.find(s => s.StatisticName === "DayExperience")?.Value || 0) + expIncrement
        },
        {
          StatisticName: "WeekExperience",
          Value: (currentStats.find(s => s.StatisticName === "WeekExperience")?.Value || 0) + expIncrement
        }
      ]
    };

    // 3. 統計情報を更新して結果を取得
    const updateStatsResult = await new Promise((resolve, reject) => {
      PlayFabServer.UpdatePlayerStatistics(updateRequest, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // 4. 更新後の統計情報を取得
          PlayFabServer.GetPlayerStatistics({
            PlayFabId: playFabId,
            StatisticNames: ["Experience", "DayExperience", "WeekExperience"]
          }, (getError, getResult) => {
            if (getError) {
              resolve(result);
            } else {
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

    // レスポンスの返却
    return NextResponse.json({
      message: '統計情報の更新が完了しました',
      result: updateStatsResult,
      playFabId,
      statistics: updateStatsResult.data?.updatedStatistics || []
    }, { status: 200 });

  } catch (error) {
    console.error('統計情報更新エラー:', error instanceof Error ? error.message : '不明なエラー');
    return NextResponse.json({
      message: 'サーバー内部エラー',
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
} 