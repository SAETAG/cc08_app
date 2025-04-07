import { NextRequest, NextResponse } from 'next/server';
import { dbAdmin, verifyTokenOrThrow } from '@/app/lib/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // 1. フロントから送られる Authorizationヘッダーを読み取り、トークンを検証
    const authHeader = req.headers.get('Authorization');
    const uid = await verifyTokenOrThrow(authHeader ?? '');

    // 2. フォームデータから値を取得
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!name || !imageUrl) {
      return NextResponse.json(
        { 
          error: '必要な情報が不足しています',
          details: {
            name: name ? '✓' : '×',
            imageUrl: imageUrl ? '✓' : '×'
          }
        },
        { status: 400 }
      );
    }

    // 3. rackIdを生成して Firestore へ書き込み
    const rackId = uuidv4();
    await dbAdmin.doc(`users/${uid}/racks/${rackId}`).set({
      name,
      imageUrl,
      ownerId: uid,
      stepsGenerated: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ 
      rackId,
      message: '登録が完了しました',
    });
  } catch (error: any) {
    console.error('Error creating rack:', {
      code: error.code,
      message: error.message,
      details: error
    });
    
    return NextResponse.json(
      { 
        error: '登録に失敗しました',
        details: {
          code: error.code,
          message: error.message
        }
      },
      { status: 500 }
    );
  }
} 