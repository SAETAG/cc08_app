import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query, conversation_id, user, inputs = {}, response_mode } = await req.json();

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
      return NextResponse.json({ error: 'API request failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 