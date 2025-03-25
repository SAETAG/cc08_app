import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, conversation_id, user, inputs = {}, response_mode } = body;

    console.log('Sending request to DifyAI:', {
      url: `${process.env.NEXT_PUBLIC_DIFY_API_URL}/chat-messages`,
      query,
      conversation_id,
      user,
      inputs,
      response_mode
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_DIFY_API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        conversation_id,
        user,
        inputs,
        response_mode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DifyAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json({ error: 'API request failed', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    console.log('DifyAI API response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 