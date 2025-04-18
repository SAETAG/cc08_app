import { NextResponse } from 'next/server'
import { dbAdmin, verifyTokenOrThrow } from '@/app/lib/firebaseAdmin'

export async function GET(
  req: Request,
  { params }: { params: { rackId: string } }
) {
  try {
    console.log('Rack data request received');
    
    // トークン検証
    const authHeader = req.headers.get("Authorization")
    const uid = await verifyTokenOrThrow(authHeader ?? "")
    console.log('User ID:', uid);

    if (!uid) {
      console.error('Unauthorized: No user ID');
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { rackId } = await params;
    console.log('Rack ID:', rackId);

    try {
      // ハンガーラックのデータを取得
      const rackRef = dbAdmin.collection('users').doc(uid).collection('racks').doc(rackId)
      const rackDoc = await rackRef.get()

      if (!rackDoc.exists) {
        console.error('Rack not found:', rackRef.path);
        return new NextResponse('Rack not found', { status: 404 })
      }

      // アドベンチャー情報を取得
      const adventuresRef = dbAdmin
        .collection('users')
        .doc(uid)
        .collection('racks')
        .doc(rackId)
        .collection('adventures');
      
      console.log('Fetching adventures from path:', adventuresRef.path);
      const adventuresSnapshot = await adventuresRef.get();
      console.log('Adventures snapshot size:', adventuresSnapshot.size);
      
      const adventures = adventuresSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Adventure data:', {
          id: doc.id,
          createdAt: data.createdAt,
          content: data.content ? 'exists' : 'missing'
        });
        try {
          const parsedContent = JSON.parse(data.content);
          return {
            id: doc.id,
            ...data,
            organizationDirection: parsedContent.organizationDirection,
            createdAt: data.createdAt
          };
        } catch (error) {
          console.error('Error parsing adventure content:', error);
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt
          };
        }
      });

      // 最新のadventureの作成日時を取得
      const latestAdventure = adventures.length > 0 
        ? adventures.reduce((latest, current) => {
            console.log('Comparing dates:', { 
              latest: latest.createdAt, 
              current: current.createdAt 
            });
            const latestDate = latest.createdAt?.seconds || 0;
            const currentDate = current.createdAt?.seconds || 0;
            return latestDate > currentDate ? latest : current;
          })
        : null;

      console.log('Latest adventure:', latestAdventure);

      const rackData = {
        ...rackDoc.data(),
        adventures,
        currentStepIndex: 0,
        progress: 0,
        latestAdventureCreatedAt: latestAdventure?.createdAt || null
      }
      
      console.log('Rack data:', rackData);
      
      return NextResponse.json(rackData)
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return new NextResponse('Database operation failed', { status: 500 })
    }
  } catch (error) {
    console.error('[RACK_GET] Unexpected error:', error);
    return new NextResponse('Internal Error', { status: 500 })
  }
} 