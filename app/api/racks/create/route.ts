import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Cookieからユーザーの認証情報を取得
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: '認証が必要です', details: 'userIdが見つかりません' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image') as File;
    const userIdFormData = formData.get('userId') as string;

    if (!name || !image || !userIdFormData) {
      return NextResponse.json(
        { 
          error: '必要な情報が不足しています',
          details: {
            name: name ? '✓' : '×',
            image: image ? '✓' : '×',
            userId: userIdFormData ? '✓' : '×'
          }
        },
        { status: 400 }
      );
    }

    console.log('Received request:', {
      userId,
      name,
      imageType: image.type,
      imageSize: image.size
    });

    // rackIdを生成
    const rackId = uuidv4();
    const filePath = `users/${userId}/racks/${rackId}/image.jpg`;

    try {
      // Firebase Storageに画像をアップロード
      const imageBuffer = await image.arrayBuffer();
      const storageRef = ref(storage, filePath);
      
      console.log('Uploading to Firebase Storage:', {
        path: filePath,
        contentType: image.type,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      });

      // Content-Typeを明示的に設定
      const metadata = {
        contentType: image.type,
        cacheControl: 'public, max-age=31536000',
      };

      await uploadBytes(storageRef, imageBuffer, metadata);

      // 画像の公開URLを取得
      const imageUrl = await getDownloadURL(storageRef);
      console.log('Image uploaded successfully:', { imageUrl });

      // Firestoreにデータを保存
      const rackRef = doc(db, 'users', userId, 'racks', rackId);
      const timestamp = Timestamp.now();
      const rackData = {
        name,
        imageUrl,
        stepsGenerated: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      console.log('Saving to Firestore:', {
        collection: 'users',
        userId,
        rackId,
        data: rackData
      });

      await setDoc(rackRef, rackData);

      console.log('Data saved successfully');

      return NextResponse.json({ 
        rackId,
        message: '登録が完了しました',
      });
    } catch (storageError: any) {
      console.error('Storage/Firestore error:', {
        code: storageError.code,
        message: storageError.message,
        details: storageError,
        status: storageError.status_,
        customData: storageError.customData
      });
      
      // エラーメッセージをより具体的に
      let errorMessage = 'データの保存に失敗しました';
      if (storageError.status_ === 404) {
        errorMessage = 'ストレージの設定が正しくありません。管理者に連絡してください。';
      } else if (storageError.code === 'storage/unauthorized') {
        errorMessage = '画像のアップロード権限がありません。再度ログインしてください。';
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: {
            code: storageError.code,
            message: storageError.message,
            status: storageError.status_
          }
        },
        { status: 500 }
      );
    }
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