import { NextResponse } from 'next/server';
import { dbAdmin, verifyTokenOrThrow } from '@/app/lib/firebaseAdmin';

export async function GET(
  req: Request,
  { params }: { params: { rackId: string } }
) {
  try {
    // トークン検証
    const authHeader = req.headers.get("Authorization");
    const uid = await verifyTokenOrThrow(authHeader ?? "");
    console.log('User ID:', uid);

    if (!uid) {
      console.error('Unauthorized: No user ID');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rackId = params.rackId;
    console.log('Fetching adventures for rack:', rackId);

    // アドベンチャー情報を取得
    const adventuresRef = dbAdmin
      .collection('users')
      .doc(uid)
      .collection('racks')
      .doc(rackId)
      .collection('adventures');

    console.log('Adventures collection path:', adventuresRef.path);
    const adventuresSnapshot = await adventuresRef.get();
    console.log('Adventures snapshot size:', adventuresSnapshot.size);
    
    if (adventuresSnapshot.empty) {
      console.log('No adventures found for rack:', rackId);
      return NextResponse.json({ createdAt: null });
    }

    // 最初のアドベンチャーの作成日時を取得
    const adventureDoc = adventuresSnapshot.docs[0];
    const adventureData = adventureDoc.data();
    console.log('Adventure data:', {
      id: adventureDoc.id,
      data: adventureData,
      createdAt: adventureData.createdAt
    });

    if (!adventureData.createdAt) {
      console.error('No createdAt field found in adventure data');
      return NextResponse.json({ createdAt: null });
    }

    return NextResponse.json({ 
      createdAt: adventureData.createdAt 
    });

  } catch (error) {
    console.error('[ADVENTURE_GET] Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 