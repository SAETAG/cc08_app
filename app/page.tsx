"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation" // ページ遷移に必要
import Cookies from 'js-cookie'
import { db, firebaseAuth } from "@/lib/firebase"
import { doc, setDoc, Timestamp } from "firebase/firestore"
import { signInAnonymously } from "firebase/auth"
import { ensureFirebaseAuth, loginToPlayFabWithFirebase, saveUserToFirestore, savePlayFabSession } from "@/lib/auth"
import Image from "next/image"

export default function Home() {
  const [loading, setLoading] = useState(false) // ログイン処理のローディング管理
  const [error, setError] = useState<string | null>(null) // エラーメッセージ
  const [isClient, setIsClient] = useState(false)
  const router = useRouter() // ページ遷移用のrouterフック

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Image
        src="/map.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-green-900/80" />
      
      {/* 魔法の装飾模様 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 大きな装飾 */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-amber-400/20 transform rotate-12"></div>
        <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-amber-300/30 transform -rotate-6"></div>
        
        {/* 画面全体を覆う装飾 */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-400/10 transform rotate-3"></div>
        <div className="absolute top-4 left-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] border-2 border-amber-300/20 transform -rotate-1"></div>
        
        {/* 左上の装飾 */}
        <div className="absolute top-10 left-10 w-24 h-24 border-2 border-amber-400/30 transform rotate-45"></div>
        <div className="absolute top-16 left-16 w-12 h-12 border border-amber-300/40 transform rotate-12"></div>
        
        {/* 右上の装飾 */}
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-amber-400/30 transform -rotate-45"></div>
        <div className="absolute top-20 right-20 w-8 h-8 border border-amber-300/40 transform -rotate-12"></div>
        
        {/* 左下の装飾 */}
        <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-amber-400/30 transform rotate-12"></div>
        <div className="absolute bottom-20 left-20 w-10 h-10 border border-amber-300/40 transform -rotate-45"></div>
        
        {/* 右下の装飾 */}
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-amber-400/30 transform -rotate-12"></div>
        <div className="absolute bottom-16 right-16 w-14 h-14 border border-amber-300/40 transform rotate-45"></div>
        
        {/* 中央の装飾 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-amber-400/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-amber-300/30 rounded-full"></div>
      </div>

      <div className="max-w-md w-full text-center space-y-6 sm:space-y-8 bg-gradient-to-br from-purple-950/95 via-blue-950/95 to-green-950/95 border-4 border-amber-500/70 shadow-[0_0_20px_rgba(251,191,36,0.4)] p-6 sm:p-8 rounded-xl relative">
        <div className="space-y-6">
          <h1 className="text-6xl sm:text-7xl font-bold text-amber-300 tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] font-['MedievalSharp']">
            Closet Chronicle
          </h1>
          <div className="space-y-1">
            <div
              className="text-lg sm:text-xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "0s" }}
            >
              この冒険は
            </div>
            <div
              className="text-lg sm:text-xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "0.5s" }}
            >
              あなたが
            </div>
            <div
              className="text-lg sm:text-xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "1s" }}
            >
              自分らしいクローゼットを
            </div>
            <div
              className="text-lg sm:text-xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "1.5s" }}
            >
              取り戻すまでの物語
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <Button
            className="w-full bg-[#f0c96b] hover:bg-[#e0b95b] text-green-900 drop-shadow-[0_0_5px_rgba(240,201,107,0.7)] font-medium py-4 px-8 rounded-lg border border-[#d8b85a] text-lg sm:text-xl transition-colors duration-200"
            onClick={handleLogin}
            disabled={loading}
          >
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-green-900" />
            <span className="text-green-900 drop-shadow-[0_0_5px_rgba(240,201,107,0.7)] text-lg sm:text-xl">
              {loading ? "ログイン中..." : "START"}
            </span>
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <p className="text-xs text-amber-300/60 mt-2 text-left">
            ・このゲームでは、音楽が再生されます（音楽：魔王魂）
            <br />
            ・音量設定等、お気を付けください。
          </p>
        </div>
      </div>
    </div>
  )
}

