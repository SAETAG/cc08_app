import { PlayFabServer } from 'playfab-sdk'
import { cookies } from 'next/headers'

// Cookie取得用のヘルパー関数
function getCookie(name: string, cookieString: string): string | undefined {
  const match = cookieString.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : undefined
}

export async function POST(request: Request) {
  try {
    // リクエストボディをログ出力
    const body = await request.json()
    console.log("Request body:", body)
    const { stageId, problems, ideals } = body

    const cookies = request.headers.get("cookie")
    if (!cookies) {
      console.log("No cookies found in request")
      return Response.json({ error: "No cookies found" }, { status: 401 })
    }

    const rawSessionTicket = getCookie("session_ticket", cookies)
    if (!rawSessionTicket) {
      console.log("No session ticket found in cookies")
      return Response.json({ error: "No session ticket found" }, { status: 401 })
    }

    const decodedOnce = decodeURIComponent(rawSessionTicket)
    const sessionTicket = decodeURIComponent(decodedOnce)
    console.log("Session ticket after double decode:", sessionTicket)

    // PlayFabの初期化と設定値の確認
    const titleId = process.env.PLAYFAB_TITLE_ID
    const secretKey = process.env.PLAYFAB_DEV_SECRET
    console.log("PlayFab Title ID:", titleId)
    console.log("PlayFab Secret Key exists:", !!secretKey)

    if (!titleId || !secretKey) {
      console.error("PlayFab credentials are missing")
      return Response.json({ error: "PlayFab credentials are missing" }, { status: 500 })
    }

    PlayFabServer.settings.titleId = titleId
    PlayFabServer.settings.developerSecretKey = secretKey

    // セッションチケットからPlayFabIDを抽出
    const playFabId = sessionTicket.split('-')[0]
    console.log("PlayFab ID:", playFabId)

    const updateRequest = {
      PlayFabId: playFabId,
      Data: {
        ...(stageId === 1 ? {
          stage1_cleared: "true",
          stage1_problems: problems,
          stage1_ideals: ideals
        } : {}),
        ...(stageId === 2 ? {
          stage2_cleared: "true"
        } : {}),
        ...(stageId === 3 ? {
          stage3_cleared: "true"
        } : {}),
        ...(stageId === 4 ? {
          stage4_cleared: "true"
        } : {}),
        ...(stageId === 5 ? {
          stage5_cleared: "true"
        } : {}),
        ...(stageId === 6 ? {
          stage6_cleared: "true"
        } : {}),
        ...(stageId === 7 ? {
          stage7_cleared: "true"
        } : {}),
        ...(stageId === 8 ? {
          stage8_cleared: "true"
        } : {}),
        ...(stageId === 9 ? {
          stage9_cleared: "true"
        } : {}),
        ...(stageId === 10 ? {
          stage10_cleared: "true"
        } : {}),
        ...(stageId === 11 ? {
          stage11_cleared: "true",
          stage11_feelings: body.feelings
        } : {}),
        ...(stageId === 12 ? {
          stage12_cleared: "true"
        } : {}),
        ...(stageId === 13 ? {
          stage13_cleared: "true"
        } : {}),
        ...(stageId === 14 ? {
          stage14_cleared: "true"
        } : {})
      }
    }
    console.log("Update request:", updateRequest)

    const result = await new Promise((resolve, reject) => {
      PlayFabServer.UpdateUserData(
        updateRequest,
        (error: any, result: any) => {
          if (error) {
            console.error("PlayFab error details:", {
              errorCode: error.errorCode,
              errorMessage: error.errorMessage,
              errorDetails: error.errorDetails,
              status: error.status
            })
            reject(error)
          } else {
            console.log("PlayFab success:", result)
            resolve(result)
          }
        }
      )
    })

    return Response.json(result)
  } catch (error) {
    console.error("Error in updateUserData:", error)
    if (error instanceof Error) {
      return Response.json({ 
        error: "Internal server error", 
        details: error.message,
        stack: error.stack 
      }, { status: 500 })
    }
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
} 