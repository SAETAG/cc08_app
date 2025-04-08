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