"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Volume2, VolumeX } from "lucide-react"
import { firebaseAuth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import Image from "next/image"

export default function CreateNamePage() {
  const [name, setName] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()

  // Firebase認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
        // 未認証の場合はトップページにリダイレクト
        router.push("/")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate name before submission
    if (name.length < 3 || name.length > 25) {
      setError("名前は3～25文字で入力してください")
      return
    }

    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      setError("英数字のみ使用可能です")
      return
    }

    setLoading(true)

    try {
      // 現在のユーザーを取得
      const currentUser = firebaseAuth.currentUser
      if (!currentUser) {
        throw new Error("認証されていません")
      }

      // IDトークンを取得
      const token = await currentUser.getIdToken()

      // PlayFabの表示名を更新
      const playFabRes = await fetch("/api/update-display-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          displayName: name,
        }),
      })

      const playFabData = await playFabRes.json()

      if (!playFabRes.ok) {
        throw new Error(playFabData.message || "名前の更新に失敗しました")
      }

      // Firestoreのユーザー情報を更新
      const userRes = await fetch("/api/users/update-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: name
        })
      })

      if (!userRes.ok) {
        const errorData = await userRes.json()
        throw new Error(errorData.message || "ユーザー名の更新に失敗しました")
      }

      console.log("✅ Username updated successfully")

      // 更新成功時はホームページに遷移
      router.push("/home")
    } catch (error) {
      console.error("Error updating display name:", error)
      setError(error instanceof Error ? error.message : "名前の更新中にエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  const toggleSound = () => {
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsMuted(!isMuted)
    }
  }

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/setting.mp3")

    if (audioRef.current) {
      audioRef.current.loop = true

      // Auto-play when component mounts (if not muted)
      if (!isMuted) {
        // We need to handle the play promise to avoid uncaught promise errors
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Auto-play was prevented. User interaction is required to play audio.")
          })
        }
      }
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

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

      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        <div className="max-w-lg w-full bg-gradient-to-br from-purple-950/95 via-blue-950/95 to-green-950/95 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6 sm:p-8 rounded-xl relative">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

          <div className="text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-300 tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]">
              新たな冒険者よ…<br />
              そなたの名前は？
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="あなたの名前"
                  className="w-full bg-black bg-opacity-50 border-amber-500/50 text-amber-300 placeholder:text-amber-300/50 focus:border-amber-300 focus:ring-amber-300"
                  required
                />
                <div className="flex justify-between text-xs text-amber-300/80">
                  <span>3～25文字で英数字のみ使用可</span>
                  <span>{name.length} 文字</span>
                </div>
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f0c96b] hover:bg-[#e0b95b] text-green-900 drop-shadow-[0_0_5px_rgba(240,201,107,0.7)] font-medium py-4 px-8 rounded-lg border border-[#d8b85a] text-lg sm:text-xl transition-colors duration-200"
              >
                {loading ? "更新中..." : "完了！"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

