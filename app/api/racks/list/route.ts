import { NextRequest, NextResponse } from 'next/server';
import { dbAdmin, verifyTokenOrThrow } from '@/app/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    // トークン検証
    const authHeader = req.headers.get('Authorization');
    const uid = await verifyTokenOrThrow(authHeader ?? '');

    // ユーザーのハンガーラック一覧を取得
    const racksSnapshot = await dbAdmin.collection(`users/${uid}/racks`).get();
    
    const racks = racksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ racks });
  } catch (error: any) {
    console.error('Error fetching racks:', {
      code: error.code,
      message: error.message,
      details: error
    });
    
    return NextResponse.json(
      { 
        error: 'ハンガーラックの取得に失敗しました',
        details: {
          code: error.code,
          message: error.message
        }
      },
      { status: 500 }
    );
  }
} 