"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Star, Lock, Home } from "lucide-react"

// Define the stages
const stages = [
  { id: 1, name: "闇の扉", icon: "🚪", unlocked: true },
  { id: 2, name: "選別の祭壇", icon: "🎁", unlocked: false },
  { id: 3, name: "解放の広間", icon: "📦", unlocked: false },
  { id: 4, name: "選ばれし者", icon: "💖", unlocked: false },
  { id: 5, name: "断捨離の審判", icon: "🗑️", unlocked: false },
  { id: 6, name: "未練の洞窟", icon: "💭", unlocked: false },
  { id: 7, name: "限界の迷宮", icon: "🏰", unlocked: false },
  { id: 8, name: "秩序の神殿", icon: "🌈", unlocked: false },
  { id: 9, name: "時の洞窟", icon: "⏳", unlocked: false },
  { id: 10, name: "収納の回廊", icon: "📍", unlocked: false },
  { id: 11, name: "対話の鏡", icon: "📖", unlocked: false },
  { id: 12, name: "確認の間", icon: "📸", unlocked: false },
  { id: 13, name: "帰還の里", icon: "🔧", unlocked: false },
  { id: 14, name: "最終決戦", icon: "🏰", unlocked: false },
]

// Array of clothing emojis for background stamps
const clothingEmojis = [
  "👒",
  "👑",
  "👗",
  "👖",
  "✨",
  "🧤",
  "💃",
  "🦺",
  "🧦",
  "👔",
  "👚",
  "👘",
  "🧣",
  "👜",
  "🧢",
  "👟",
  "👠",
  "🥾",
  "🧥",
]

// Pre-generate positions for background emojis to avoid hydration errors
const backgroundEmojis = Array(15)
  .fill(null)
  .map((_, i) => ({
    id: i,
    emoji: clothingEmojis[i % clothingEmojis.length],
    style: {
      top: `${i * 6.5}%`,
      left: `${(i * 7) % 100}%`,
      opacity: 0.3,
      fontSize: "3.5rem",
      transform: `rotate(${i % 2 === 0 ? 10 : -10}deg)`,
      filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
    },
  }))

export default function ClosetPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [selectedStage, setSelectedStage] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setIsClient(true)
  }, [])

  // シンプルな音声初期化 - クライアントサイドでのみ実行
  useEffect(() => {
    if (!isClient) return

    const audioElement = new Audio("/closet.mp3")
    audioElement.loop = true
    audioElement.volume = 0.7
    setAudio(audioElement)

    try {
      audioElement.play().catch((error) => {
        console.log("Auto-play was prevented:", error)
      })
    } catch (error) {
      console.log("Audio play error:", error)
    }

    return () => {
      audioElement.pause()
      audioElement.src = ""
    }
  }, [isClient])

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    if (!audio || !isClient) return

    audio.muted = isMuted

    // ミュート解除時に再生を試みる
    if (!isMuted && audio.paused) {
      try {
        audio.play().catch((error) => {
          console.log("Play on unmute failed:", error)
        })
      } catch (error) {
        console.log("Play error:", error)
      }
    }
  }, [isMuted, audio, isClient])

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // 画面タップで再生を試みる関数
  const tryPlayAudio = () => {
    if (!audio || !isClient) return

    if (audio.paused && !isMuted) {
      try {
        audio.play().catch((error) => {
          console.log("Play on screen tap failed:", error)
        })
      } catch (error) {
        console.log("Play error:", error)
      }
    }
  }

  // Close welcome message
  const closeWelcome = () => {
    setShowWelcome(false)

    // ウェルカムメッセージを閉じる時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Handle stage selection
  const handleStageSelect = (stageId: number) => {
    const stage = stages.find((s) => s.id === stageId)
    if (stage && stage.unlocked) {
      setSelectedStage(stageId)
      // Navigate to the stage page
      router.push(`/closet/${stageId}`)
    }
  }

  const getStagePosition = (index: number, total: number) => {
    // Create a more pronounced curved path
    const progress = index / (total - 1)

    // Calculate x position using a sine wave for a curved path
    // Multiply by a larger number for more pronounced curves
    const amplitude = 120 // Increased amplitude for wider curves
    const xOffset = Math.sin(progress * Math.PI * 2) * amplitude

    // Increase vertical spacing between stages significantly
    return {
      left: `calc(50% + ${xOffset}px)`,
      top: `${100 + progress * 1800}px`, // Increased from 1200 to 1800 for even more vertical space
    }
  }

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col" onClick={isClient ? tryPlayAudio : undefined}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <Link href="/home">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
            クローゼット王国
          </h1>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Link href="/home">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center p-4 relative">
        {/* Welcome message from Mo-chan */}
        {showWelcome && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-teal-900 rounded-xl p-6 max-w-md border-2 border-yellow-500 shadow-lg relative">
              <h2 className="text-xl font-bold text-yellow-300 mb-4 text-center">クローゼット王国</h2>

              <p className="text-white text-center mb-6">
                クローゼット王国へようこそ！１ステージづつ片付けいこう！さぁ、冒険だ！
              </p>

              <div className="flex justify-center">
                <Button
                  onClick={closeWelcome}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold"
                >
                  クローゼット王国へ
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Background clothing stamps - with fixed positions */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden">
            {backgroundEmojis.map((item) => (
              <div key={item.id} className="absolute" style={item.style as React.CSSProperties}>
                {item.emoji}
              </div>
            ))}
          </div>
        )}

        {/* Stages path */}
        <div className="w-full max-w-md mx-auto mt-4 pb-20 relative">
          {/* Stages */}
          <div className="relative h-[2000px] w-full overflow-auto">
            {stages.map((stage, index) => {
              const position = getStagePosition(index, stages.length)

              // Calculate connection line position to previous stage
              let connectionStyle = {}
              if (index > 0) {
                const prevPosition = getStagePosition(index - 1, stages.length)
                const startX = Number.parseFloat(prevPosition.left.replace("calc(50% + ", "").replace("px)", ""))
                const startY = Number.parseFloat(prevPosition.top.replace("px", ""))
                const endX = Number.parseFloat(position.left.replace("calc(50% + ", "").replace("px)", ""))
                const endY = Number.parseFloat(position.top.replace("px", ""))

                // Calculate angle and length
                const dx = endX - startX
                const dy = endY - startY
                const length = Math.sqrt(dx * dx + dy * dy)
                const angle = Math.atan2(dy, dx) * (180 / Math.PI)

                connectionStyle = {
                  width: `${length}px`,
                  height: "4px",
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "0 50%",
                  left: `calc(50% + ${startX}px)`,
                  top: `${startY}px`,
                  position: "absolute",
                  background: "linear-gradient(to right, #60a5fa, #3b82f6)",
                  borderRadius: "2px",
                  zIndex: 5,
                }
              }

              return (
                <div key={stage.id}>
                  {/* Connection line to previous stage */}
                  {index > 0 && <div style={connectionStyle as React.CSSProperties} />}

                  {/* Stage button */}
                  <div
                    className="absolute"
                    style={{
                      left: position.left,
                      top: position.top,
                      transform: "translate(-50%, -50%)",
                      zIndex: 10,
                    }}
                  >
                    <button
                      onClick={() => handleStageSelect(stage.id)}
                      disabled={!stage.unlocked}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        stage.unlocked ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-70"
                      }`}
                    >
                      {/* Glowing effect for unlocked stages */}
                      <div
                        className={`absolute inset-0 rounded-full ${
                          stage.unlocked ? "bg-blue-500 animate-pulse" : "bg-gray-600"
                        }`}
                      ></div>

                      {/* Border */}
                      <div className="absolute inset-0 rounded-full border-2 border-yellow-500"></div>

                      {/* Stage content */}
                      <div className="relative z-10 text-3xl">
                        {stage.unlocked ? stage.icon : <Lock className="h-8 w-8 text-gray-300" />}
                      </div>
                    </button>

                    {/* Stage name */}
                    <div className="mt-2 rpg-nameplate bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 px-3 py-1">
                      <p className="text-white text-center text-sm sm:text-base">
                        {stage.name}
                        {stage.id === 1 && (
                          <span className="ml-1 text-yellow-300">
                            <Star className="h-4 w-4 inline" />
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

