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
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/map.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-green-900/80" />
      </div>

      {/* Sound toggle button */}
      <button
        onClick={toggleSound}
        className="absolute top-4 right-4 z-20 bg-green-800 hover:bg-green-900 text-amber-300 p-3 rounded-full transition-colors duration-200 border border-amber-500/50"
        aria-label={isMuted ? "音楽を再生" : "音楽を停止"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <div className="max-w-md w-full bg-gradient-to-br from-green-900/90 to-green-950/90 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-amber-500/50 z-10 relative">
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-300 tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]">
            まずはあなたの名前を教えてね！
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
  )
}

