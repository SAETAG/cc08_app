import { NextRequest, NextResponse } from 'next/server';
import { dbAdmin, verifyTokenOrThrow } from '@/app/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    // トークン検証
    const authHeader = req.headers.get('Authorization');
    const uid = await verifyTokenOrThrow(authHeader ?? '');

    // ユーザーのハンガーラック一覧を取得
    const racksSnapshot = await dbAdmin.collection(`users/${uid}/racks`).get();
    
    const racks = await Promise.all(racksSnapshot.docs.map(async (doc) => {
      const rackData = doc.data();
      console.log('Rack data:', rackData);
      
      // アドベンチャー情報を取得（各ラックに1つだけ存在）
      const adventuresSnapshot = await dbAdmin
        .collection('users')
        .doc(uid)
        .collection('racks')
        .doc(doc.id)
        .collection('adventures')
        .get();

      let adventureCreatedAt = null;
      if (!adventuresSnapshot.empty) {
        // 最初のドキュメントの作成日時を使用
        const adventureDoc = adventuresSnapshot.docs[0];
        const adventureData = adventureDoc.data();
        console.log('Adventure data:', {
          id: adventureDoc.id,
          createdAt: adventureData.createdAt
        });
        adventureCreatedAt = adventureData.createdAt;
      }

      const rackWithAdventure = {
        id: doc.id,
        ...rackData,
        latestAdventureCreatedAt: adventureCreatedAt
      };
      console.log('Final rack data:', rackWithAdventure);
      return rackWithAdventure;
    }));

    console.log('All racks data:', racks);
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