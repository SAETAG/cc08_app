import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { PlayFabAdmin } from "playfab-sdk"

const titleId = process.env.PLAYFAB_TITLE_ID || ""
const secretKey = process.env.PLAYFAB_DEV_SECRET || ""

PlayFabAdmin.settings.titleId = titleId
PlayFabAdmin.settings.developerSecretKey = secretKey

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const playfabId = cookieStore.get("playfab_id")?.value

    if (!playfabId) {
      return NextResponse.json(
        { error: "PlayFab IDが見つかりません" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "必要なパラメータが不足しています" },
        { status: 400 }
      )
    }

    return new Promise((resolve) => {
      PlayFabAdmin.UpdateUserData({
        PlayFabId: playfabId,
        Data: {
          [key]: value.toString()
        },
        Permission: "Public"
      }, (error, result) => {
        if (error) {
          console.error("Error updating user data:", error)
          resolve(
            NextResponse.json(
              { error: "データの更新に失敗しました" },
              { status: 500 }
            )
          )
          return
        }

        resolve(
          NextResponse.json(
            { 
              code: 200,
              status: "OK",
              data: result.data
            },
            { status: 200 }
          )
        )
      })
    })
  } catch (error) {
    console.error("Error in updateUserData:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    )
  }
} 