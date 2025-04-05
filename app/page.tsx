"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation" // ページ遷移に必要
import Cookies from 'js-cookie'
import { db, firebaseAuth } from "@/lib/firebase"
import { doc, setDoc, Timestamp } from "firebase/firestore"
import { signInAnonymously } from "firebase/auth"
import { ensureFirebaseAuth, loginToPlayFabWithFirebase, saveUserToFirestore, savePlayFabSession } from "@/lib/auth"

export default function Home() {
  const [loading, setLoading] = useState(false) // ログイン処理のローディング管理
  const [error, setError] = useState<string | null>(null) // エラーメッセージ
  const [isClient, setIsClient] = useState(false)
  const router = useRouter() // ページ遷移用のrouterフック

  const clothingEmojis = ["👒", "👑", "👗", "👙", "👖", "✨", "🧤", "💃", "🦺", "🧦"]

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // ① Firebase匿名認証の確認と必要に応じてログイン
      const firebaseUser = await ensureFirebaseAuth()
      console.log("✅ Firebase user:", firebaseUser.uid)
      
      // ② Firebase IDトークンの取得
      const idToken = await firebaseUser.getIdToken()
      console.log("✅ Firebase ID token length:", idToken.length)
      
      // ③ PlayFabにFirebase IDトークンでログイン
      const playFabData = await loginToPlayFabWithFirebase(idToken)
      console.log("✅ PlayFab response:", playFabData)
      
      if (!playFabData.success) {
        throw new Error(playFabData.error || "PlayFabログインに失敗しました")
      }
      
      const { PlayFabId, SessionTicket, NewlyCreated } = playFabData.result.data
      
      // ④ PlayFabのセッション情報をCookieに保存
      savePlayFabSession(PlayFabId, SessionTicket)
      
      // ⑤ Firestoreにユーザーデータを保存
      await saveUserToFirestore(firebaseUser, PlayFabId)
      
      // ⑥ 適切な画面へ遷移
      if (NewlyCreated) {
        router.push("/prologue")
      } else {
        router.push("/home")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(`ログイン中にエラーが発生しました: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teal-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl float-animation"
            style={
              isClient
                ? {
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0.2 + Math.random() * 0.3,
                    transform: `scale(${0.8 + Math.random() * 0.7})`,
                    animationDuration: `${6 + Math.random() * 8}s`,
                    animationDelay: `${Math.random() * 5}s`,
                  }
                : {
                    top: "0%",
                    left: "0%",
                    opacity: 0,
                    transform: "scale(1)",
                    animationDuration: "0s",
                    animationDelay: "0s",
                  }
            }
          >
            {isClient ? clothingEmojis[Math.floor(Math.random() * clothingEmojis.length)] : "✨"}
          </div>
        ))}
      </div>

      <div className="max-w-md w-full text-center space-y-6 sm:space-y-8 bg-teal-900 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-700 z-10 relative">
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-bold text-yellow-300 tracking-tight drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
            Closet Chronicle
          </h1>
          <div className="mt-12 space-y-1">
            <div
              className="text-xl sm:text-2xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "0s" }}
            >
              この冒険は
            </div>
            <div
              className="text-xl sm:text-2xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "0.5s" }}
            >
              あなたが
            </div>
            <div
              className="text-xl sm:text-2xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "1s" }}
            >
              自分らしいクローゼットを
            </div>
            <div
              className="text-xl sm:text-2xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "1.5s" }}
            >
              取り戻すまでの物語
            </div>
          </div>
        </div>

        <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <Button
            className="w-full bg-teal-800 hover:bg-teal-700 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-2 border border-teal-600 transition-colors duration-200"
            onClick={handleLogin}
            disabled={loading} // ローディング中にボタンを無効化
          >
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-200" />
            <span className="text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] text-lg sm:text-xl">
              {loading ? "ログイン中..." : "START"}
            </span>
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* エラーメッセージ表示 */}
          <p className="text-xs text-teal-300 opacity-80 mt-2 text-left">
            ・このゲームでは、音楽が再生されます（音楽：魔王魂）
            <br />
            ・音量設定等、お気を付けください。
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-16 bg-teal-950 opacity-90 z-0"></div>
      <div className="absolute bottom-0 w-full h-8 bg-teal-950 opacity-95 z-0"></div>
    </div>
  )
}

