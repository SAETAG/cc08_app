import { NextRequest, NextResponse } from "next/server"
import { dbAdmin, verifyTokenOrThrow } from "@/app/lib/firebaseAdmin"

export async function GET(
  req: NextRequest,
  { params }: { params: { rackId: string } }
) {
  try {
    // トークン検証
    const authHeader = req.headers.get("Authorization")
    const uid = await verifyTokenOrThrow(authHeader ?? "")

    // パラメータを正しく取得（awaitを追加）
    const { rackId } = await params

    // ハンガーラックのデータを取得
    const rackDoc = await dbAdmin.collection("users").doc(uid).collection("racks").doc(rackId).get()

    if (!rackDoc.exists) {
      return NextResponse.json(
        { error: "ハンガーラックが見つかりません" },
        { status: 404 }
      )
    }

    const rackData = rackDoc.data()
    return NextResponse.json({
      rack: {
        id: rackDoc.id,
        ...rackData,
      }
    })

  } catch (error) {
    console.error("Error fetching rack:", error)
    return NextResponse.json(
      { error: "ハンガーラックの取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: { rackId: string } }
) {
  try {
    console.log('Update request received');
    
    // トークン検証
    const authHeader = req.headers.get("Authorization")
    const uid = await verifyTokenOrThrow(authHeader ?? "")
    console.log('User ID:', uid);

    if (!uid) {
      console.error('Unauthorized: No user ID');
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { stepsGenerated } = await req.json()
    console.log('Request body:', { stepsGenerated });
    
    // パラメータを取得
    const { rackId } = params
    console.log('Rack ID:', rackId);

    if (!rackId) {
      console.error('Bad Request: No rack ID');
      return new NextResponse('Bad Request: No rack ID', { status: 400 });
    }

    try {
      // ハンガーラックの更新
      const rackRef = dbAdmin.collection('users').doc(uid).collection('racks').doc(rackId)
      console.log('Updating rack:', rackRef.path);
      
      // 更新前のデータを確認
      const rackDoc = await rackRef.get()
      if (!rackDoc.exists) {
        console.error('Rack not found:', rackRef.path);
        return new NextResponse('Rack not found', { status: 404 })
      }

      const currentData = rackDoc.data();
      console.log('Current rack data:', currentData);
      console.log('Current stepsGenerated value:', currentData?.stepsGenerated);
      
      // 更新を実行
      const updateData = {
        stepsGenerated: stepsGenerated,
        updatedAt: new Date()
      };
      console.log('Updating with data:', updateData);
      
      await rackRef.update(updateData);
      console.log('Update operation completed');

      // 更新後のデータを取得して返す
      const updatedRack = await rackRef.get()
      const rackData = updatedRack.data()
      console.log('Updated rack data:', rackData);
      console.log('New stepsGenerated value:', rackData?.stepsGenerated);
      
      return NextResponse.json(rackData)
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return new NextResponse('Database operation failed', { status: 500 })
    }
  } catch (error) {
    console.error('[RACK_UPDATE] Unexpected error:', error);
    return new NextResponse('Internal Error', { status: 500 })
  }
} 