import { NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Firebase Adminの初期化
const apps = getApps()
if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

export async function GET(
  request: Request,
  { params }: { params: { rackId: string } }
) {
  try {
    const auth = getAuth()
    const db = getFirestore()
    const rackId = params.rackId

    // ユーザーIDを取得
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    // ラックのドキュメントを取得
    const rackDoc = await db.collection("users").doc(uid).collection("racks").doc(rackId).get()

    if (!rackDoc.exists) {
      return NextResponse.json({ error: "ラックが見つかりません" }, { status: 404 })
    }

    const rackData = rackDoc.data()
    const beforeImageUrl = rackData?.imageUrl

    if (!beforeImageUrl) {
      return NextResponse.json({ error: "ビフォー写真が見つかりません" }, { status: 404 })
    }

    return NextResponse.json({ beforeImageUrl })
  } catch (error) {
    console.error("ビフォー写真の取得に失敗しました:", error)
    return NextResponse.json(
      { error: "ビフォー写真の取得に失敗しました" },
      { status: 500 }
    )
  }
} 