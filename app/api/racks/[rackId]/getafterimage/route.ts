import { NextRequest, NextResponse } from "next/server"
import { dbAdmin } from "@/lib/firebaseAdmin"
import { getAuth } from "firebase-admin/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { rackId: string } }
) {
  try {
    // 認証トークンの検証
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: "認証トークンがありません" },
        { status: 401 }
      )
    }
    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await getAuth().verifyIdToken(token)
    const uid = decodedToken.uid

    const rackId = params.rackId

    // FirestoreからアフターイメージのURLを取得
    const rackDoc = await dbAdmin
      .collection('users')
      .doc(uid)
      .collection('racks')
      .doc(rackId)
      .get()

    if (!rackDoc.exists) {
      return NextResponse.json(
        { error: "ラックが見つかりません" },
        { status: 404 }
      )
    }

    const rackData = rackDoc.data()
    const afterimageUrl = rackData?.afterimageUrl || null

    return NextResponse.json(
      { afterimageUrl },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error in getafterimage:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    )
  }
} 