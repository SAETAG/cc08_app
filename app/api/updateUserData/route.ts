import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const PLAYFAB_TITLE_ID = process.env.PLAYFAB_TITLE_ID
const PLAYFAB_SECRET_KEY = process.env.PLAYFAB_DEV_SECRET

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const playFabId = cookieStore.get('playfab_id')?.value

    if (!playFabId) {
      console.error("PlayFabID not found in cookies:", cookieStore.getAll())
      return NextResponse.json(
        { error: "PlayFabIDが見つかりません" },
        { status: 401 }
      )
    }

    const { rackId, stageNumber } = await request.json()
    
    if (!rackId || !stageNumber) {
      return NextResponse.json(
        { error: "必要なパラメータが不足しています" },
        { status: 400 }
      )
    }

    const key = `rack_${rackId}_stage_${stageNumber}_status`
    
    // PlayFab Admin API を使用してユーザーデータを更新
    const response = await fetch(
      `https://${PLAYFAB_TITLE_ID}.playfabapi.com/Admin/UpdateUserData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SecretKey": PLAYFAB_SECRET_KEY || "",
        },
        body: JSON.stringify({
          PlayFabId: playFabId,
          Data: {
            [key]: "true"
          }
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("PlayFab API Error:", data)
      return NextResponse.json(
        { error: "データの更新に失敗しました" },
        { status: 500 }
      )
    }

    console.log("Successfully updated PlayFab data for user:", playFabId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user data:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    )
  }
} 