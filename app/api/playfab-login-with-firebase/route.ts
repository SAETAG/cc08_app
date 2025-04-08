import { NextResponse } from "next/server"
import { PlayFabClient } from "playfab-sdk"
import { getAuth } from "firebase-admin/auth"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Firebase Admin初期化
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

// PlayFab TitleIDの設定
const titleId = process.env.PLAYFAB_TITLE_ID!
PlayFabClient.settings.titleId = titleId

export async function POST(request: Request) {
  try {
    const { firebaseToken } = await request.json()

    if (!firebaseToken) {
      return NextResponse.json(
        { success: false, error: "Firebase token is required" },
        { status: 400 }
      )
    }

    // Firebase トークンを検証してUIDを取得
    const decodedToken = await getAuth().verifyIdToken(firebaseToken)
    const firebaseUid = decodedToken.uid

    console.log("✅ Verified Firebase UID:", firebaseUid)

    // PlayFabのLoginWithCustomIDをPromiseでラップ
    const loginResult: any = await new Promise((resolve, reject) => {
      PlayFabClient.LoginWithCustomID({
        CustomId: firebaseUid,
        CreateAccount: true
      }, (error, result) => {
        if (error) {
          console.error("PlayFab API Error:", {
            code: error.code,
            status: error.status,
            error: error.error,
            errorCode: error.errorCode,
            errorMessage: error.errorMessage,
            errorDetails: error.errorDetails
          })
          reject(new Error(`PlayFab Error (${error.errorCode}): ${error.errorMessage}`))
        } else {
          console.log("✅ PlayFab login success:", {
            playFabId: result.data.PlayFabId,
            newlyCreated: result.data.NewlyCreated
          })
          resolve(result)
        }
      })
    })

    // レスポンスデータの構造を整形
    return NextResponse.json({
      success: true,
      result: {
        data: {
          PlayFabId: loginResult.data.PlayFabId,
          SessionTicket: loginResult.data.SessionTicket,
          NewlyCreated: loginResult.data.NewlyCreated,
        }
      }
    })
  } catch (error: any) {
    console.error("PlayFab login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "PlayFabログインに失敗しました"
      },
      { status: 500 }
    )
  }
} 