"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Trophy, Star, Home, ArrowLeft, Sparkles } from "lucide-react"

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

export default function DungeonClearPage() {
  const params = useParams()
  const router = useRouter()
  const rackId = params.rackId as string
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  // ハートと星のエフェクトを生成
  useEffect(() => {
    const newSymbols = []
    for (let i = 0; i < 100; i++) {
      newSymbols.push({
        x: Math.random() * window.innerWidth,
        y: -100 - Math.random() * 500, // 画面上部から少し上に配置して徐々に降ってくるように
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
  }, [])

  // ハートと星のアニメーション
  useEffect(() => {
    if (fallingSymbols.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // キャンバスサイズをウィンドウに合わせる
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // シンボルを描画する関数
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

    // アニメーションループ
    const animationFrame = requestAnimationFrame(function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      setFallingSymbols((prevSymbols) =>
        prevSymbols.map((symbol) => {
          // シンボルを移動
          const newX = symbol.x + symbol.speedX
          const newY = symbol.y + symbol.speedY
          const newRotation = symbol.rotation + symbol.rotationSpeed

          // 画面外に出たら上に戻す
          if (newY > canvas.height + 50) {
            return {
              ...symbol,
              x: Math.random() * canvas.width,
              y: -50 - Math.random() * 100,
              rotation: Math.random() * 360,
            }
          }

          // 左右の画面外に出たら反対側から出てくる
          let adjustedX = newX
          if (newX < -50) adjustedX = canvas.width + 25
          if (newX > canvas.width + 50) adjustedX = -25

          return {
            ...symbol,
            x: adjustedX,
            y: newY,
            rotation: newRotation,
          }
        }),
      )

      // 全てのシンボルを描画
      fallingSymbols.forEach(drawSymbol)

      requestAnimationFrame(animate)
    })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [fallingSymbols])

  // アニメーションのタイミングを制御
  useEffect(() => {
    // トロフィーを表示
    const trophyTimer = setTimeout(() => {
      setShowTrophy(true)
    }, 500)

    // おめでとうテキストを表示
    const congratsTimer = setTimeout(() => {
      setShowCongrats(true)
    }, 1500)

    // 経験値を表示
    const expTimer = setTimeout(() => {
      setShowExp(true)

      // 経験値のカウントアップアニメーション
      let count = 0
      const interval = setInterval(() => {
        count += 5
        setExpCount(count)

        if (count >= 200) {
          clearInterval(interval)
        }
      }, 50)
    }, 3000)

    // 王の間メッセージを表示
    const kingMessageTimer = setTimeout(() => {
      setShowKingMessage(true)
    }, 6000)

    // ボタンを表示
    const buttonsTimer = setTimeout(() => {
      setShowButtons(true)
    }, 8000)

    return () => {
      clearTimeout(trophyTimer)
      clearTimeout(congratsTimer)
      clearTimeout(expTimer)
      clearTimeout(kingMessageTimer)
      clearTimeout(buttonsTimer)
    }
  }, [])

  // 経験値を受け取る処理
  const handleReceiveExp = () => {
    // 実際のアプリでは経験値をデータベースに保存する処理を行います
    router.push(`/castle`)
  }

  return (
    <div className="min-h-screen w-full bg-[url('/abstract-geometric-shapes.png')] bg-cover bg-center flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
      {/* ハートと星のエフェクトのキャンバス */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* 光の効果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-500/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-500/10 blur-3xl"
            animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
          />
        </div>
      </div>

      {/* 魔法陣 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[500px] h-[500px] border-2 border-amber-600/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] border border-amber-600/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] border border-blue-600/10 rounded-full"
          animate={{ rotate: 180 }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      {/* ナビゲーションリンク */}
      <AnimatePresence>
        {showButtons && (
          <motion.div
            className="absolute top-8 left-8 z-20 flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={`/castle/hanger/${rackId}`}
              className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors bg-blue-900/50 px-3 py-2 rounded-md"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span>ダンジョンマップに戻る</span>
            </Link>

            <Link
              href="/castle"
              className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors bg-blue-900/50 px-3 py-2 rounded-md"
            >
              <Home className="mr-2 h-5 w-5" />
              <span>クローゼット城に戻る</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* メインコンテンツ */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        {/* トロフィー */}
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

        {/* おめでとうテキスト */}
        <AnimatePresence>
          {showCongrats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <motion.h1
                className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300"
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

        {/* 経験値表示 */}
        <AnimatePresence>
          {showExp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-amber-900/30 to-amber-800/30 px-10 py-6 rounded-xl border-2 border-amber-500/30 relative overflow-hidden">
                <Star className="h-12 w-12 text-amber-400" />
                <div className="text-center">
                  <div className="text-amber-300/80 text-xl mb-1">獲得経験値</div>
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

                {/* 光るエフェクト */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />

                {/* 星のエフェクト */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                      repeatDelay: Math.random() * 2,
                    }}
                  >
                    <Sparkles className="h-3 w-3 text-amber-400/70" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 王の間解放メッセージ */}
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

                <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 px-12 py-8 rounded-xl border-2 border-purple-500/40 relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl">👑</span>
                    <h2 className="text-3xl font-bold text-purple-300">特別な報酬</h2>
                  </div>

                  <motion.p
                    className="text-2xl text-purple-200 font-medium"
                    animate={{
                      textShadow: [
                        "0 0 5px rgba(147,51,234,0.5)",
                        "0 0 10px rgba(147,51,234,0.7)",
                        "0 0 5px rgba(147,51,234,0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    王の間が解放されました
                  </motion.p>

                  {/* 光るエフェクト */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />

                  {/* 装飾的な角 */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-400/40"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-400/40"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-400/40"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-400/40"></div>

                  {/* 星のエフェクト */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.3,
                        repeatDelay: Math.random() * 2,
                      }}
                    >
                      <span className="text-lg">✨</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 経験値を受け取るボタン */}
        <AnimatePresence>
          {showButtons && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <motion.button
                onClick={handleReceiveExp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-2xl font-medium py-5 px-12 rounded-lg shadow-lg border border-amber-400/30 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Star className="h-6 w-6" />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
