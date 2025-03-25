import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const PLAYFAB_TITLE_ID = process.env.PLAYFAB_TITLE_ID;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'all';
  
  let statisticName = "";
  switch (period) {
    case "daily":
      statisticName = "DayExperience";
      break;
    case "weekly":
      statisticName = "WeekExperience";
      break;
    case "all":
    default:
      statisticName = "Experience";
      break;
  }

  // cookieの取得
  const cookieHeader = request.headers.get('cookie');
  console.log('Cookie header:', cookieHeader);

  // セッションチケットの取得とデコード
  const sessionTicketMatch = cookieHeader?.split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('session_ticket='));

  const sessionTicket = sessionTicketMatch
    ? decodeURIComponent(sessionTicketMatch.split('=')[1])
    : undefined;

  console.log('Session ticket:', sessionTicket);

  if (!sessionTicket) {
    console.error('No session ticket found in cookies');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Making request to PlayFab with session ticket:', sessionTicket);
    // まずユーザーの統計情報を取得
    const userStatsResponse = await fetch(`https://${PLAYFAB_TITLE_ID}.playfabapi.com/Client/GetPlayerStatistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionTicket,
      },
      body: JSON.stringify({
        StatisticNames: [statisticName]
      }),
    });

    const userStatsData = await userStatsResponse.json();
    console.log('User stats response:', userStatsData);

    // リーダーボードデータを取得
    const leaderboardResponse = await fetch(`https://${PLAYFAB_TITLE_ID}.playfabapi.com/Client/GetLeaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionTicket,
      },
      body: JSON.stringify({
        StatisticName: statisticName,
        MaxResultsCount: 100,
        StartPosition: 0
      }),
    });

    const leaderboardData = await leaderboardResponse.json();
    console.log('PlayFab leaderboard response:', leaderboardData);

    if (!leaderboardResponse.ok || leaderboardData.error) {
      console.error('PlayFab API error:', leaderboardData.errorMessage || leaderboardData.error);
      return NextResponse.json({ error: leaderboardData.errorMessage || 'Failed to fetch leaderboard' }, { status: leaderboardResponse.status || 500 });
    }

    // ユーザーの統計情報を取得
    const userStats = userStatsData.data.Statistics?.[0] || null;
    const userStatValue = userStats ? userStats.Value : 0;

    return NextResponse.json({
      data: {
        leaderboard: leaderboardData.data,
        currentUser: {
          statisticValue: userStatValue,
          statisticName: statisticName
        }
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 