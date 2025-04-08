"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Trophy, Star, ChevronRight, ArrowLeft, Home } from "lucide-react"

// 紙吹雪の色
const confettiColors = [
  "#FFD700", // ゴールド
  "#FFA500", // オレンジ
  "#FF4500", // レッドオレンジ
  "#1E90FF", // ドジャーブルー
  "#00BFFF", // ディープスカイブルー
  "#87CEEB", // スカイブルー
  "#FFFFFF", // ホワイト
]

export default function StageClearPage() {
  const params = useParams()
  const router = useRouter()
  const rackId = params.rackId as string
  const stepId = params.stepId as string

  const [confetti, setConfetti] = useState<
    Array<{ x: number; y: number; color: string; size: number; angle: number; speed: number }>
  >([])
  const [showTrophy, setShowTrophy] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [experiencePoints, setExperiencePoints] = useState(0)
  const [targetExperiencePoints, setTargetExperiencePoints] = useState(0)

  // 紙吹雪を生成
  useEffect(() => {
    const newConfetti = []
    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        x: Math.random() * 100,
        y: -10 - Math.random() * 10,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: Math.random() * 8 + 5,
        angle: Math.random() * 360,
        speed: Math.random() * 3 + 2,
      })
    }
    setConfetti(newConfetti)
  }, [])

  // アニメーションのタイミングを制御
  useEffect(() => {
    // トロフィーを表示
    const trophyTimer = setTimeout(() => {
      setShowTrophy(true)
    }, 500)

    // CLEARテキストを表示
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 1200)

    // ボタンを表示
    const buttonsTimer = setTimeout(() => {
      setShowButtons(true)
    }, 2000)

    // 経験値を設定（モックデータ）
    const expPoints = Math.floor(Math.random() * 50) + 50 // 50-100のランダムな値
    setTargetExperiencePoints(expPoints)

    // 経験値のカウントアップアニメーション
    const expTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setExperiencePoints((prev) => {
          if (prev >= expPoints) {
            clearInterval(interval)
            return expPoints
          }
          return prev + 1
        })
      }, 30)

      return () => clearInterval(interval)
    }, 2500)

    return () => {
      clearTimeout(trophyTimer)
      clearTimeout(textTimer)
      clearTimeout(buttonsTimer)
      clearTimeout(expTimer)
    }
  }, [])

  // 紙吹雪のアニメーション
  useEffect(() => {
    if (confetti.length === 0) return

    const interval = setInterval(() => {
      setConfetti((prev) =>
        prev.map((c) => {
          // 画面外に出た紙吹雪は上に戻す
          if (c.y > 110) {
            return {
              ...c,
              y: -10,
              x: Math.random() * 100,
            }
          }

          // 紙吹雪を落下させる
          return {
            ...c,
            y: c.y + c.speed,
            x: c.x + Math.sin(c.angle * (Math.PI / 180)) * 0.5, // 左右に揺れる動き
            angle: c.angle + Math.random() * 2 - 1, // 角度をわずかに変化させる
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [confetti])

  // 次のステージに進む
  const goToNextStage = () => {
    // 実際のアプリでは次のステージIDを計算する必要があります
    const nextStepId = `step${Number.parseInt(stepId.replace("step", "")) + 1}`
    router.push(`/castle/hanger/${rackId}`)
  }

  // 経験値を獲得
  const getExperiencePoints = () => {
    // 実際のアプリでは経験値をデータベースに保存する処理を行います
    alert(`${experiencePoints}ポイントの経験値を獲得しました！`)
  }

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
      {/* ナビゲーションリンク */}
      <div className="absolute top-8 left-8 z-20 flex gap-4">
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
      </div>

      {/* 紙吹雪 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((c, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${c.size}px`,
              height: `${c.size * 0.4}px`,
              backgroundColor: c.color,
              transform: `rotate(${c.angle}deg)`,
              opacity: 0.8,
            }}
            animate={{ opacity: [0.8, 0.6, 0.8] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        ))}
      </div>

      {/* 光の効果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2">
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
        </div>
      </div>

      {/* 魔法陣 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[400px] h-[400px] border-2 border-amber-600/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] border border-amber-600/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] border border-blue-600/10 rounded-full"
          animate={{ rotate: 180 }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center">
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
                  <Trophy className="w-32 h-32" />
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

        {/* CLEARテキスト */}
        <AnimatePresence>
          {showText && (
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
                CLEAR!
              </motion.h1>
              <motion.div
                className="mt-4 text-2xl text-amber-300/90 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                ステージクリアおめでとう！
              </motion.div>

              {/* 経験値表示 */}
              <motion.div
                className="mt-8 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Star className="h-6 w-6 text-amber-400" />
                <span className="text-2xl font-bold text-amber-300">{experiencePoints} EXP</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ボタン */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 items-center w-80"
            >
              <motion.button
                onClick={getExperiencePoints}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xl font-medium py-4 px-8 rounded-lg shadow-lg border border-amber-400/30 relative overflow-hidden group flex items-center justify-center w-full gap-3"
              >
                <Star className="h-6 w-6" />
                <span className="relative z-10">経験値をGET</span>
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

              <motion.button
                onClick={goToNextStage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xl font-medium py-4 px-8 rounded-lg shadow-lg border border-blue-400/30 relative overflow-hidden group flex items-center justify-center w-full gap-3 mt-2"
              >
                <span className="relative z-10">次のステージに進む</span>
                <ChevronRight className="h-6 w-6" />
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-blue-400/80"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1 }}
                />
                <motion.span
                  className="absolute -inset-1 opacity-0 group-hover:opacity-30"
                  animate={{
                    boxShadow: [
                      "inset 0 0 10px 5px rgba(59,130,246,0.1)",
                      "inset 0 0 20px 10px rgba(59,130,246,0.2)",
                      "inset 0 0 10px 5px rgba(59,130,246,0.1)",
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

