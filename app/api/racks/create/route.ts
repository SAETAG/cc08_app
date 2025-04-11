import { NextRequest, NextResponse } from 'next/server';
import { dbAdmin, verifyTokenOrThrow } from '@/app/lib/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

export async function POST(req: NextRequest) {
  try {
    // 1. フロントから送られる Authorizationヘッダーを読み取り、トークンを検証
    const authHeader = req.headers.get('Authorization');
    const uid = await verifyTokenOrThrow(authHeader ?? '');

    // 2. フォームデータから値を取得
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image') as File;

    if (!name || !image) {
      return NextResponse.json(
        { 
          error: '必要な情報が不足しています',
          details: {
            name: name ? '✓' : '×',
            image: image ? '✓' : '×'
          }
        },
        { status: 400 }
      );
    }

    // 画像のバリデーション
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "画像ファイルのみアップロード可能です" },
        { status: 400 }
      );
    }

    // 3. rackIdを生成して Firestore へ書き込み
    const rackId = uuidv4();
    await dbAdmin.doc(`users/${uid}/racks/${rackId}`).set({
      name,
      ownerId: uid,
      stepsGenerated: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. 画像をアップロード
    const storage = getStorage();
    const bucket = storage.bucket('closetchronicle-dev.firebasestorage.app');
    const filePath = `users/${uid}/racks/${rackId}/image.jpg`;
    const file = bucket.file(filePath);

    // 画像をアップロード
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await file.save(buffer, {
      metadata: {
        contentType: image.type,
      },
    });

    // アップロードした画像のダウンロードURLを取得
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // 長期間有効なURLを生成
    });

    // 5. Firestoreに画像URLを更新
    await dbAdmin.doc(`users/${uid}/racks/${rackId}`).update({
      imageUrl: url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      rackId,
      imageUrl: url,
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