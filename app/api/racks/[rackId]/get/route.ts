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

    const rackId = params.rackId
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
      const adventuresRef = rackDoc.ref.collection('adventures')
      const adventuresSnapshot = await adventuresRef.get()
      
      const adventures = adventuresSnapshot.docs.map(doc => {
        const data = doc.data();
        try {
          const parsedContent = JSON.parse(data.content);
          return {
            id: doc.id,
            ...data,
            organizationDirection: parsedContent.organizationDirection
          };
        } catch (error) {
          console.error('Error parsing adventure content:', error);
          return {
            id: doc.id,
            ...data
          };
        }
      });

      const rackData = {
        ...rackDoc.data(),
        adventures,
        currentStepIndex: 0,
        progress: 0
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