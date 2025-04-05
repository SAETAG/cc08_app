"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Volume2, VolumeX } from "lucide-react"
import { firebaseAuth, db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

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

      // PlayFabの表示名を更新
      const res = await fetch("/api/update-display-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          displayName: name,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "名前の更新に失敗しました")
      }

      // Firestoreのユーザー情報を更新
      const userDocRef = doc(db, "users", currentUser.uid)
      await updateDoc(userDocRef, {
        username: name
      })

      console.log("✅ Username updated in Firestore")

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
      if (isMuted) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-teal-950">
      {/* Sound toggle button */}
      <button
        onClick={toggleSound}
        className="absolute top-4 right-4 z-20 bg-indigo-700 hover:bg-indigo-800 text-yellow-300 p-3 rounded-full transition-colors duration-200 border border-indigo-500"
        aria-label={isMuted ? "音楽を再生" : "音楽を停止"}
      >
        {isMuted ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <div className="max-w-md w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 bg-opacity-90 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-indigo-400 z-10 relative">
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300 tracking-tight drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
            まずはあなたの名前を教えてね！
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="あなたの名前"
                className="w-full bg-black bg-opacity-50 border-indigo-400 text-white placeholder:text-gray-400 focus:border-yellow-300 focus:ring-yellow-300"
                required
              />
              <div className="flex justify-between text-xs text-gray-300">
                <span>3～25文字で英数字のみ使用可</span>
                <span>{name.length} 文字</span>
              </div>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-4 px-8 rounded-lg border border-orange-500 text-lg sm:text-xl transition-colors duration-200"
            >
              {loading ? "更新中..." : "完了！"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

