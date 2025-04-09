"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Star, Home, ArrowLeft, Sparkles, Upload, Camera } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// ハートと星のエフェクト用の設定
const symbols = ["❤️", "✨", "💖", "⭐", "💫", "💕", "✨", "💓", "🌟", "💗"]
const symbolColors = [
  "#FF69B4", // ホットピンク
  "#FFD700", // ゴールド
  "#FF1493", // ディープピンク
  "#FFC0CB", // ピンク
  "#FFFF00", // イエロー
  "#FF6347", // トマト
  "#FF4500", // オレンジレッド
  "#FF8C00", // ダークオレンジ
  "#FF00FF", // マゼンタ
  "#FFFFFF", // ホワイト
]

// モーちゃんのコメントパターン
const moChanComments = [
  "おおおお！よくぞこの試練を乗り越えたモー！立派な冒険者モー！🗡️🔥",
  "うおおお！その手際、まるで伝説の整理騎士モー！🛡️✨",
  "わお！モノたちも居場所ができて喜んでるモー！📦🎉",
  "すごいすごい！心の乱れが整ってきた気がするモ〜✨🧘‍♀️🌀",
  "いえい！装備庫の魔力が安定したモー、次の冒険に進む準備は万端モー！🪄🔮",
  "おぉぉぉ！きらりと光るそのセンス、さすが選ばれし者モー！💫👑",
  "ななな…！ここまで来るとは、モーちゃんも感無量モー…！😭🌈",
  "おおっ！あっぱれな整理術！この地の守り神も微笑んでいるモー！🧹🛕",
  "すごい！やればできる！その勇気に祝福を贈るモー！💪💖",
  "えらい！小さな一歩が、やがて大きな王国を築くモー！🏰🪙",
  "天才！モノの気持ちも、きっと晴れやかモー☀️👚",
  "すごいよぉ！お片付けの魔法、完全にマスターしてきたモーね！🪄📖",
  "控えめに言って…神！その調子で、全ステージ制覇も夢じゃないモー！🎯🚀",
  "大大大天才！クローゼット界の英雄として記録に刻まれるモー📜🧥",
  "やるやん！モーちゃんが目をつけた冒険者、間違いなかったモー！🧐💎",
  "大優勝！魔王の混沌も、あなたには敵わないモー！👹💥",
  "すばらしい！！心と空間、両方がスッキリ浄化されたモー〜🧼🫧",
  "んなななな…！なんと、これは……伝説の「片付け大勇者様」かもしれないモー！🐉📘",
  "よく頑張ったね！整理の女神も、きっとあなたに微笑んでいるモー✨👼",
  "グッジョブ！次なるクエストでも、モーちゃんは応援してるモー💖🐮🗺️",
]

export default function DungeonClearPage() {
  const params = useParams()
  const router = useRouter()
  const rackId = params.rackId as string
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for the new flow
  const [step, setStep] = useState<"upload" | "comparison" | "celebration" | "complete">("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [beforeImage, setBeforeImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [moChanComment, setMoChanComment] = useState("")

  // Original animation states
  const [fallingSymbols, setFallingSymbols] = useState<
    Array<{
      x: number
      y: number
      size: number
      symbol: string
      color: string
      rotation: number
      rotationSpeed: number
      speedX: number
      speedY: number
      opacity: number
    }>
  >([])

  const [showTrophy, setShowTrophy] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showExp, setShowExp] = useState(false)
  const [expCount, setExpCount] = useState(0)
  const [showKingMessage, setShowKingMessage] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  // Set a placeholder before image
  useEffect(() => {
    // Simulating fetching a before image - using a placeholder
    setBeforeImage("/overflowing-wardrobe.png")
  }, [])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle file upload (simulated)
  const handleUpload = async () => {
    if (!uploadedImage) return

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false)
      setStep("comparison")
    }, 1500)
  }

  // Handle reporting to Mo-chan
  const handleReportToMoChan = () => {
    // Select a random comment
    const randomComment = moChanComments[Math.floor(Math.random() * moChanComments.length)]
    setMoChanComment(randomComment)
    setStep("celebration")
  }

  // Start the dungeon clear animation
  const startClearAnimation = async () => {
    try {
      // PlayFabにデータを保存
      const response = await fetch("/api/updateUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: `rack_${rackId}_status`,
          value: true
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "データの更新に失敗しました")
      }

      setStep("complete")

      // Generate falling symbols
      const newSymbols = []
      for (let i = 0; i < 100; i++) {
        newSymbols.push({
          x: Math.random() * window.innerWidth,
          y: -100 - Math.random() * 500,
          size: Math.random() * 20 + 15,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          color: symbolColors[Math.floor(Math.random() * symbolColors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.7,
        })
      }
      setFallingSymbols(newSymbols)

      // Start the animation sequence
      setTimeout(() => setShowTrophy(true), 500)
      setTimeout(() => setShowCongrats(true), 1500)
      setTimeout(() => {
        setShowExp(true)

        // Experience count animation
        let count = 0
        const interval = setInterval(() => {
          count += 5
          setExpCount(count)
          if (count >= 200) clearInterval(interval)
        }, 50)
      }, 3000)
      setTimeout(() => setShowKingMessage(true), 6000)
      setTimeout(() => setShowButtons(true), 8000)
    } catch (error) {
      console.error("Error updating rack status:", error)
      alert(error instanceof Error ? error.message : "エラーが発生しました")
    }
  }

  // Handle the canvas animation for falling symbols
  useEffect(() => {
    if (fallingSymbols.length === 0 || step !== "complete") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Resize canvas to window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Draw symbols
    const drawSymbol = (symbol: (typeof fallingSymbols)[0]) => {
      ctx.save()
      ctx.translate(symbol.x, symbol.y)
      ctx.rotate((symbol.rotation * Math.PI) / 180)
      ctx.font = `${symbol.size}px Arial`
      ctx.fillStyle = symbol.color
      ctx.globalAlpha = symbol.opacity
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(symbol.symbol, 0, 0)
      ctx.restore()
    }

    // Animation loop
    const animationFrame = requestAnimationFrame(function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      setFallingSymbols((prevSymbols) =>
        prevSymbols
          .map((symbol) => {
            const newX = symbol.x + symbol.speedX
            const newY = symbol.y + symbol.speedY
            const newRotation = symbol.rotation + symbol.rotationSpeed

            if (newY > canvas.height + 50) {
              return null
            }

            return {
              ...symbol,
              x: newX,
              y: newY,
              rotation: newRotation,
            }
          })
          .filter(Boolean),
      )

      fallingSymbols.forEach(drawSymbol)

      if (fallingSymbols.length > 0) {
        requestAnimationFrame(animate)
      }
    })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [fallingSymbols, step])

  // Receive experience points
  const handleReceiveExp = () => {
    router.push(`/castle`)
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
      {/* Canvas for falling symbols */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* Magical floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-500/20 blur-sm"
            style={{
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        ))}
      </div>

      {/* Light effects */}
      <div className="absolute left-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"></div>
      <div
        className="absolute right-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Navigation links */}
      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => router.push(`/castle/hanger/${rackId}`)}
          className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>ダンジョンマップに戻る</span>
        </button>
      </div>

      <div className="fixed top-8 right-8 z-20">
        <button
          onClick={() => router.push("/castle")}
          className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
        >
          <Home className="mr-2 h-5 w-5" />
          <span>クローゼット城に戻る</span>
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl">
        {/* Step 1: Photo Upload */}
        {step === "upload" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[500px] bg-gradient-to-b from-blue-900/90 to-blue-950/90 p-8 rounded-xl border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
          >
            <h2 className="text-3xl font-semibold text-amber-400 text-center mb-6">
              片付いたハンガーラックの写真を撮ろう！
            </h2>

            <div className="flex flex-col items-center gap-6">
              {uploadedImage ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={uploadedImage || "/placeholder.svg"}
                    alt="アップロード済み画像"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={triggerFileInput}
                      className="bg-blue-900/70 text-amber-300 border-amber-500/50 hover:bg-blue-800/70"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      再選択
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className="w-full h-64 border-2 border-dashed border-amber-500/50 rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-amber-400 hover:bg-blue-800/20 transition-colors"
                >
                  <Camera className="h-16 w-16 text-amber-400/70" />
                  <p className="text-amber-300">クリックして写真を選択</p>
                </div>
              )}

              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />

              <Button
                onClick={handleUpload}
                disabled={!uploadedImage || isUploading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xl font-medium py-6 rounded-lg shadow-lg border border-amber-400/30 relative overflow-hidden group"
              >
                {isUploading ? (
                  <>
                    <span className="mr-2">アップロード中...</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Upload className="h-5 w-5" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    写真をアップロード
                  </>
                )}
                <motion.span
                  className="absolute -inset-1 opacity-0 group-hover:opacity-30"
                  animate={{
                    boxShadow: [
                      "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                      "inset 0 0 20px 10px rgba(251,191,36,0.2)",
                      "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Before/After Comparison */}
        {step === "comparison" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[700px] bg-gradient-to-b from-blue-900/90 to-blue-950/90 p-8 rounded-xl border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
          >
            <h2 className="text-3xl font-semibold text-amber-400 text-center mb-6">ビフォーアフター</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <p className="text-amber-300 mb-2 font-medium">Before</p>
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-blue-950/50">
                  {beforeImage ? (
                    <Image src={beforeImage || "/placeholder.svg"} alt="整理前" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-amber-400/70">画像がありません</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-amber-300 mb-2 font-medium">After</p>
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image src={uploadedImage! || "/placeholder.svg"} alt="整理後" fill className="object-cover" />
                </div>
              </div>
            </div>

            <Button
              onClick={handleReportToMoChan}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-xl font-medium py-6 rounded-lg shadow-lg border border-purple-400/30 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                モーちゃんに片付け完了の報告をする
              </span>
              <motion.span
                className="absolute -inset-1 opacity-0 group-hover:opacity-30"
                animate={{
                  boxShadow: [
                    "inset 0 0 10px 5px rgba(147,51,234,0.1)",
                    "inset 0 0 20px 10px rgba(147,51,234,0.2)",
                    "inset 0 0 10px 5px rgba(147,51,234,0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </Button>
          </motion.div>
        )}

        {/* Step 3: Mo-chan's Comment */}
        {step === "celebration" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[500px] bg-gradient-to-b from-purple-900/90 to-purple-950/90 p-8 rounded-xl border-2 border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.2)]"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-28 h-28 rounded-full bg-purple-700/50 flex items-center justify-center overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(147,51,234,0.2)",
                    "0 0 15px rgba(147,51,234,0.4)",
                    "0 0 0 rgba(147,51,234,0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="relative w-24 h-24">
                  <Image src="/cow-fairy.webp" alt="モーちゃん" fill className="object-contain" />
                </div>
              </motion.div>
            </div>

            <div className="bg-purple-800/50 p-6 rounded-xl mb-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-purple-800/50"></div>
              <p className="text-xl text-center text-purple-200">{moChanComment}</p>
            </div>

            <motion.div initial={{ scale: 0.9 }} animate={{ scale: [0.9, 1.05, 1] }} transition={{ duration: 0.5 }}>
              <Button
                onClick={startClearAnimation}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xl font-medium py-6 rounded-lg shadow-lg border border-amber-400/30 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  ダンジョンクリア！
                </span>
                <motion.span
                  className="absolute -inset-1 opacity-0 group-hover:opacity-30"
                  animate={{
                    boxShadow: [
                      "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                      "inset 0 0 20px 10px rgba(251,191,36,0.2)",
                      "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Step 4: Original Clear Animation */}
        {step === "complete" && (
          <>
            {/* Trophy */}
            <AnimatePresence>
              {showTrophy && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 100 }}
                  className="mb-8"
                >
                  <div className="relative">
                    <motion.div
                      className="text-amber-400"
                      animate={{
                        filter: [
                          "drop-shadow(0 0 10px rgba(251,191,36,0.5))",
                          "drop-shadow(0 0 20px rgba(251,191,36,0.7))",
                          "drop-shadow(0 0 10px rgba(251,191,36,0.5))",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Trophy className="w-40 h-40" />
                    </motion.div>
                    <motion.div
                      className="absolute -inset-4 rounded-full z-0"
                      animate={{
                        boxShadow: [
                          "0 0 20px 10px rgba(251,191,36,0.2)",
                          "0 0 40px 20px rgba(251,191,36,0.3)",
                          "0 0 20px 10px rgba(251,191,36,0.2)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Congratulations text */}
            <AnimatePresence>
              {showCongrats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-12 text-center"
                >
                  <motion.h1
                    className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300"
                    animate={{
                      backgroundPosition: ["0% center", "100% center", "0% center"],
                      textShadow: [
                        "0 0 10px rgba(251,191,36,0.6), 0 0 15px rgba(251,191,36,0.4), 0 0 30px rgba(251,191,36,0.2)",
                        "0 0 15px rgba(251,191,36,0.8), 0 0 20px rgba(251,191,36,0.6), 0 0 40px rgba(251,191,36,0.4)",
                        "0 0 10px rgba(251,191,36,0.6), 0 0 15px rgba(251,191,36,0.4), 0 0 30px rgba(251,191,36,0.2)",
                      ],
                    }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    style={{ backgroundSize: "200% auto" }}
                  >
                    ダンジョンクリアおめでとう！
                  </motion.h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Experience points */}
            <AnimatePresence>
              {showExp && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-16"
                >
                  <div className="w-[500px] flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-amber-900/30 to-amber-800/30 px-12 py-8 rounded-xl border-2 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)] relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-2">
                      <Star className="h-12 w-12 text-amber-400" />
                      <h2 className="text-3xl font-semibold text-amber-300">獲得経験値</h2>
                    </div>

                    <div className="text-center">
                      <motion.div
                        className="text-5xl font-bold text-amber-300"
                        animate={{
                          textShadow: [
                            "0 0 5px rgba(251,191,36,0.5)",
                            "0 0 10px rgba(251,191,36,0.7)",
                            "0 0 5px rgba(251,191,36,0.5)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {expCount} EXP
                      </motion.div>
                    </div>

                    <motion.button
                      onClick={handleReceiveExp}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xl font-medium py-3 px-8 rounded-lg shadow-lg border border-amber-400/30 relative overflow-hidden group mt-4"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <Star className="h-5 w-5" />
                        経験値を受け取る
                      </span>
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-amber-500/80 to-amber-400/80"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 1 }}
                      />
                      <motion.span
                        className="absolute -inset-1 opacity-0 group-hover:opacity-30"
                        animate={{
                          boxShadow: [
                            "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                            "inset 0 0 20px 10px rgba(251,191,36,0.2)",
                            "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* King's room unlock message */}
            <AnimatePresence>
              {showKingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  className="mb-16 relative"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-6 rounded-xl z-0"
                      animate={{
                        boxShadow: [
                          "0 0 20px 10px rgba(147,51,234,0.2)",
                          "0 0 40px 20px rgba(147,51,234,0.3)",
                          "0 0 20px 10px rgba(147,51,234,0.2)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    />

                    <div className="w-[500px] flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-purple-900/50 to-purple-800/50 px-12 py-8 rounded-xl border-2 border-purple-500/40 shadow-[0_0_15px_rgba(147,51,234,0.15)] relative overflow-hidden">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl">👑</span>
                        <h2 className="text-3xl font-semibold text-purple-300">王の間解放</h2>
                      </div>

                      <div className="text-center">
                        <motion.p
                          className="text-s text-purple-200 font-medium"
                          animate={{
                            textShadow: [
                              "0 0 5px rgba(147,51,234,0.5)",
                              "0 0 10px rgba(147,51,234,0.7)",
                              "0 0 5px rgba(147,51,234,0.5)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <span className="text-sm text-purple-300/70 block">
                            ※他のダンジョンを先にクリア済の場合、その時点で既に解放済
                          </span>
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}
