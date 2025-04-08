import { NextResponse } from "next/server"
import { verifyTokenOrThrow } from "@/lib/firebaseAdmin"
import { dbAdmin } from "@/lib/firebaseAdmin"
import * as admin from "firebase-admin"

export async function GET(
  request: Request,
  { params }: { params: { rackId: string; stepId: string } }
) {
  try {
    // Bearerトークンの取得と検証
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("No authorization header or invalid format")
      return NextResponse.json(
        { error: "認証トークンが必要です" },
        { status: 401 }
      )
    }

    // トークンの前処理
    const token = authHeader.split(" ")[1]
    if (!token) {
      console.error("Token is empty")
      return NextResponse.json(
        { error: "認証トークンが不正です" },
        { status: 401 }
      )
    }
    
    // stepIdから"-step-1"を削除
    const cleanStepId = params.stepId.replace(/-step-\d+$/, "")
    
    try {
      // トークンの検証
      const decodedToken = await admin.auth().verifyIdToken(token)
      const uid = decodedToken.uid
      console.log("Token verified for user:", uid)

      // Firestoreからデータを取得
      const adventureDoc = await dbAdmin
        .collection("users")
        .doc(uid)
        .collection("racks")
        .doc(params.rackId)
        .collection("adventures")
        .doc(cleanStepId)
        .get()

      if (!adventureDoc.exists) {
        console.error("Adventure not found:", { rackId: params.rackId, stepId: cleanStepId })
        return NextResponse.json(
          { error: "アドベンチャーが見つかりません" },
          { status: 404 }
        )
      }

      const adventureData = adventureDoc.data()
      if (!adventureData) {
        console.error("No data found in adventure document")
        return NextResponse.json(
          { error: "データが見つかりません" },
          { status: 404 }
        )
      }

      console.log("Adventure data retrieved successfully")

      // contentをパースしてステップ情報を取得
      const content = JSON.parse(adventureData.content)
      const stepNumber = adventureData.stepNumber || 1
      const stepInfo = content.steps.find((step: any) => step.stepNumber === stepNumber)

      if (!stepInfo) {
        console.error("Step info not found for step number:", stepNumber)
        return NextResponse.json(
          { error: "ステップ情報が見つかりません" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        dungeonName: stepInfo.dungeonName,
        title: stepInfo.title,
        description: stepInfo.description,
        hint: stepInfo.hint,
        stepNumber: stepNumber,
      })
    } catch (verifyError) {
      console.error("Token verification error:", verifyError)
      return NextResponse.json(
        { error: "認証トークンが無効です" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Error fetching adventure:", error)
    return NextResponse.json(
      { error: "アドベンチャーの取得に失敗しました" },
      { status: 500 }
    )
  }
} 