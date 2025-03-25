import { NextResponse } from 'next/server';

const PLAYFAB_TITLE_ID = process.env.PLAYFAB_TITLE_ID;
const PLAYFAB_DEV_SECRET = process.env.PLAYFAB_DEV_SECRET;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playFabId = searchParams.get('playFabId');

    console.log('Fetching EXP for PlayFabId:', playFabId);
    console.log('Using PLAYFAB_TITLE_ID:', PLAYFAB_TITLE_ID);

    if (!playFabId) {
      return NextResponse.json({ error: 'PlayFabId is required' }, { status: 400 });
    }

    const response = await fetch(`https://${PLAYFAB_TITLE_ID}.playfabapi.com/Admin/GetUserData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SecretKey': PLAYFAB_DEV_SECRET || '',
      },
      body: JSON.stringify({
        PlayFabId: playFabId,
        Keys: ['EXP'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PlayFab API Error:', errorData);
      throw new Error('Failed to fetch user data from PlayFab');
    }

    const data = await response.json();
    console.log('PlayFab Raw Response:', JSON.stringify(data, null, 2));

    // PlayFabのレスポンス構造に合わせて修正
    const expData = data.data?.Data?.EXP;
    console.log('EXP Data:', JSON.stringify(expData, null, 2));

    if (!expData) {
      console.log('No EXP data found in response');
      return NextResponse.json({ exp: 0 });
    }

    const expValue = parseInt(expData.Value || '0', 10);
    console.log('Extracted EXP value:', expValue);

    return NextResponse.json({ exp: expValue });
  } catch (error) {
    console.error('Error fetching player EXP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 