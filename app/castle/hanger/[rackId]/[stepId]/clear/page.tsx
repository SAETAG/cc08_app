"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Trophy, Star, ChevronRight, ArrowLeft, Home, Award, Sparkles } from "lucide-react"

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

// 称号リスト
const titles = ["見習い冒険者", "勇敢な戦士", "熟練した探検家", "伝説の英雄", "神話の守護者"]

// 称号に対応する絵文字
const titleEmojis = {
  見習い冒険者: "🔰",
  勇敢な戦士: "⚔️",
  熟練した探検家: "🧭",
  伝説の英雄: "👑",
  神話の守護者: "✨",
}

export default function StageClearPage() {
  type ConfettiType = { x: number; y: number; color: string; size: number; angle: number; speed: number }
  
  const params = useParams()
  const router = useRouter()
  const rackId = params?.rackId as string
  const stepId = params?.stepId as string

  const [confetti, setConfetti] = useState<Array<ConfettiType>>([])
  const [expProgress, setExpProgress] = useState(0)
  const [maxExpForLevel, setMaxExpForLevel] = useState(100)
  const [experiencePoints, setExperiencePoints] = useState(0)
  const [targetExperiencePoints, setTargetExperiencePoints] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [newLevel, setNewLevel] = useState(1)
  const [animationStage, setAnimationStage] = useState(0)
  // 0: 初期状態
  // 1: 経験値GET表示
  // 2: レベルアップ表示
  // 3: 称号獲得表示
  // 4: 完了状態

  const [title, setTitle] = useState("")
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; speed: number; delay: number; color: string }>>([])
  const [countingUp, setCountingUp] = useState(false)

  // 紙吹雪を生成
  useEffect(() => {
    const newConfetti: Array<ConfettiType> = []
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

    // パーティクルを生成
    const newParticles: Array<{ x: number; y: number; size: number; speed: number; delay: number; color: string }> = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        speed: Math.random() * 2 + 1,
        delay: Math.random() * 2,
        color: `hsl(${Math.random() * 60 + 30}, 100%, 70%)`,
      })
    }
    setParticles(newParticles)
  }, [])

  // アニメーションのタイミングを制御
  useEffect(() => {
    // 次のレベルに必要な経験値
    setMaxExpForLevel(100)

    // 経験値を設定（モックデータ）
    const expPoints = Math.floor(Math.random() * 50) + 30 // 30-80のランダムな値
    setTargetExperiencePoints(expPoints)

    // 新しいレベルを設定
    const newLevelValue = currentLevel + 1
    setNewLevel(newLevelValue)

    // 称号を設定
    setTitle(titles[Math.min(newLevelValue - 1, titles.length - 1)])

    // 経験値GET表示
    const expGetTimer = setTimeout(() => {
      setAnimationStage(1)
      setCountingUp(true)

      // 経験値のカウントアップアニメーション
      let count = 0
      const interval = setInterval(() => {
        if (count >= expPoints) {
          clearInterval(interval)
          setCountingUp(false)
          return
        }
        count += 1
        setExperiencePoints(count)
      }, 50)

      return () => {
        clearInterval(interval)
      }
    }, 500)

    // レベルアップ表示
    const levelUpTimer = setTimeout(() => {
      setAnimationStage(2)

      // 進捗バーのアニメーション
      const progressInterval = setInterval(() => {
        setExpProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 2
        })
      }, 50)

      return () => {
        clearInterval(progressInterval)
      }
    }, 3000)

    // 称号獲得表示
    const titleTimer = setTimeout(() => {
      setAnimationStage(3)
    }, 6500)

    // 完了状態
    const completeTimer = setTimeout(() => {
      setAnimationStage(4)
    }, 10000)

    return () => {
      clearTimeout(expGetTimer)
      clearTimeout(levelUpTimer)
      clearTimeout(titleTimer)
      clearTimeout(completeTimer)
    }
  }, [currentLevel])

  // 紙吹雪のアニメーション
  useEffect(() => {
    if (confetti.length === 0) return

    const interval = setInterval(() => {
      setConfetti((prev) =>
        prev.map((c) => {
          if (c.y > 110) {
            return {
              ...c,
              y: -10,
              x: Math.random() * 100,
            }
          }

          return {
            ...c,
            y: c.y + c.speed,
            x: c.x + Math.sin(c.angle * (Math.PI / 180)) * 0.5,
            angle: c.angle + Math.random() * 2 - 1,
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [confetti])

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-violet-800/60">
      {/* ナビゲーションリンク */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href={`/castle/hanger/${rackId}`}
          className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>ダンジョンマップに戻る</span>
        </Link>
      </div>

      <div className="absolute top-8 right-8 z-20">
        <Link
          href="/castle"
          className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
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

      {/* パーティクル効果 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
            }}
            animate={{
              y: ["0%", "100%"],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.speed * 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* 経験値GET表示 */}
        <AnimatePresence>
          {animationStage === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/20 to-amber-500/0"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: [0, 1.5, 1],
                  rotate: [180, 0],
                }}
                transition={{
                  duration: 1.5,
                  times: [0, 0.6, 1],
                  ease: "easeOut",
                }}
                className="relative mb-8"
              >
                <motion.div
                  className="text-amber-400"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 20px rgba(251,191,36,0.7))",
                      "drop-shadow(0 0 40px rgba(251,191,36,0.9))",
                      "drop-shadow(0 0 20px rgba(251,191,36,0.7))",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Star className="w-40 h-40" />
                </motion.div>

                {/* 放射状の光線 */}
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-[300px] h-[2px] bg-gradient-to-r from-amber-400 to-transparent"
                      style={{
                        transformOrigin: "0 50%",
                        transform: `rotate(${i * 45}deg) translateY(-50%)`,
                      }}
                      animate={{ scaleX: [0, 1, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.1,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 mb-8"
                style={{ backgroundSize: "200% auto" }}
              >
                経験値GET!
              </motion.h1>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="relative"
              >
                <div className="flex items-center justify-center">
                  <motion.span
                    key={experiencePoints}
                    initial={{ scale: 1.5, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-6xl font-bold text-amber-300 relative"
                  >
                    +{experiencePoints}
                    {countingUp && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-yellow-300"
                  animate={{
                          opacity: [1, 0],
                          scale: [0, 1.5],
                          y: [0, -15],
                          x: [0, Math.random() * 10 - 5],
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </motion.span>
                  <span className="text-3xl font-bold text-amber-300 ml-2">EXP</span>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* レベルアップ表示 */}
        <AnimatePresence>
          {animationStage === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.5, 1],
                  y: [50, -20, 0],
                }}
                transition={{
                  duration: 1.5,
                  times: [0, 0.6, 1],
                  ease: "easeOut",
                }}
                className="relative mb-8"
              >
                <motion.div
                  className="text-amber-400"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 20px rgba(251,191,36,0.7))",
                      "drop-shadow(0 0 40px rgba(251,191,36,0.9))",
                      "drop-shadow(0 0 20px rgba(251,191,36,0.7))",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Trophy className="w-40 h-40" />
                </motion.div>

                {/* 光の輪 */}
                <motion.div
                  className="absolute -inset-8 rounded-full"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 2],
                    borderWidth: [20, 0],
                    borderColor: ["rgba(251,191,36,0.7)", "rgba(251,191,36,0)"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 0.5,
                  }}
                  style={{
                    border: "5px solid rgba(251,191,36,0.7)",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: [0.5, 1.2, 1],
                }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 mb-8"
                style={{ backgroundSize: "200% auto" }}
              >
                レベルアップ!
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex items-center justify-center gap-6 mb-12"
              >
                <motion.span
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="text-4xl font-bold text-amber-300"
                >
                  Lv.{currentLevel}
                </motion.span>

                <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                  <ChevronRight className="h-10 w-10 text-amber-300" />
                </motion.div>

                <motion.span
                  initial={{ x: 50, opacity: 0, scale: 1 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: [1, 1.5, 1.2],
                  }}
                  transition={{
                    delay: 1.4,
                    duration: 0.8,
                    scale: {
                      times: [0, 0.5, 1],
                    },
                  }}
                  className="text-6xl font-bold text-amber-300"
                >
                  Lv.{newLevel}
                </motion.span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="w-full max-w-md"
              >
                <div className="w-full bg-gray-700/50 rounded-full h-8 border border-amber-500/30 overflow-hidden shadow-lg">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full flex items-center justify-end px-3"
                    initial={{ width: "0%" }}
                    animate={{ width: `${expProgress}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  >
                    <span className="text-sm font-bold text-amber-900">{Math.round(expProgress)}%</span>
                  </motion.div>
                </div>

                <div className="flex justify-between w-full text-sm text-amber-300/80 mt-2">
                  <span>Lv.{currentLevel}</span>
                  <span>Lv.{newLevel}</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 称号獲得表示 */}
        <AnimatePresence mode="wait">
          {animationStage === 3 && (
            <motion.div
              key="title-acquisition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* 背景エフェクト */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-purple-500/0 via-purple-500/20 to-purple-500/0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* 中央の賞アイコン */}
              <motion.div
                initial={{ scale: 0, y: -100, opacity: 0 }}
                animate={{
                  scale: 1,
                  y: 0,
                  opacity: 1,
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 1.5,
                  rotateY: {
                    duration: 1.5,
                    ease: "easeInOut",
                  },
                }}
                className="relative mb-8"
              >
                <motion.div
                  className="text-amber-400"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 20px rgba(251,191,36,0.7))",
                      "drop-shadow(0 0 40px rgba(251,191,36,0.9))",
                      "drop-shadow(0 0 20px rgba(251,191,36,0.7))",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Award className="w-40 h-40" />
                </motion.div>

                {/* 光の波紋 */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border-2 border-amber-400/60"
                    initial={{ width: 0, height: 0 }}
                    animate={{
                      width: [0, 300],
                      height: [0, 300],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.7,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 1,
                    }}
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </motion.div>

              {/* テキスト */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 mb-8 text-center"
                style={{ backgroundSize: "200% auto" }}
              >
                あなたは称号を手に入れた！
              </motion.h1>

              {/* 称号表示 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateY: 0
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut"
                }}
                className="relative"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <div
                  className="text-5xl font-bold text-amber-300 bg-violet-900/40 px-12 py-6 rounded-lg border-2 border-amber-400/50 shadow-2xl flex items-center gap-4"
                  style={{
                    boxShadow: "0 0 40px 20px rgba(251,191,36,0.2)",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden"
                  }}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-6xl"
                  >
                    {titleEmojis[title] || "🌟"}
                  </motion.span>
                  『{title}』
                </div>

                {/* 装飾的な光の線 */}
                <motion.div
                  className="absolute -bottom-4 left-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{ transform: "translateX(-50%)" }}
                />
              </motion.div>

              {/* 小さな星のエフェクト */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-amber-300"
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.cos((i * 45 * Math.PI) / 180) * 250,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 250,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    delay: 1.8 + i * 0.1,
                    duration: 1.5,
                    ease: "easeOut",
                  }}
                >
                  <Sparkles size={24} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 完了状態 */}
        <AnimatePresence>
          {animationStage === 4 && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
              className="bg-violet-900/60 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6 shadow-lg w-full max-w-md flex flex-col items-center"
            >
              {/* CLEAR! テキスト */}
              <motion.h1
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 mb-8"
                animate={{ 
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Number.POSITIVE_INFINITY, 
                  repeatType: "reverse",
                  scale: {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse"
                  }
                }}
                style={{ backgroundSize: "200% auto" }}
              >
                CLEAR!
              </motion.h1>

              <motion.div
                className="text-amber-400 mb-4"
                animate={{
                  filter: [
                    "drop-shadow(0 0 10px rgba(251,191,36,0.5))",
                    "drop-shadow(0 0 20px rgba(251,191,36,0.7))",
                    "drop-shadow(0 0 10px rgba(251,191,36,0.5))",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Trophy className="w-16 h-16" />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 mb-4 text-center"
                animate={{ backgroundPosition: ["0% center", "100% center", "0% center"] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                style={{ backgroundSize: "200% auto" }}
              >
                レベル {newLevel} 達成!
              </motion.h2>

              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-5 w-5 text-amber-300" />
                <span className="text-lg text-amber-300">+{experiencePoints} EXP</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Award className="h-5 w-5 text-amber-300" />
                <span className="text-lg text-amber-300">
                  {titleEmojis[title] || "🌟"} 『{title}』
                </span>
              </div>

              <div className="flex flex-col gap-4 items-center w-full mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/castle/hanger/${rackId}`)}
                  className="bg-gradient-to-r from-blue-600/90 to-cyan-600/90 hover:from-blue-500/90 hover:to-cyan-500/90 text-amber-200 text-lg font-medium py-4 px-8 rounded-lg shadow-lg border-2 border-amber-400/50 relative overflow-hidden group flex items-center justify-center w-full gap-3"
              >
                <span className="relative z-10">次のステージに進む</span>
                <ChevronRight className="h-5 w-5 text-amber-200" />
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1 }}
                />
                  <div className="absolute inset-0 bg-[url('/swirling-arcana.png')] opacity-10" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/home")}
                  className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500/90 hover:to-indigo-500/90 text-amber-200 text-lg font-medium py-4 px-8 rounded-lg shadow-lg border-2 border-amber-400/50 relative overflow-hidden group flex items-center justify-center w-full gap-3 mt-2"
                >
                  <Home className="h-5 w-5 text-amber-200" />
                  <span className="relative z-10">ホームに戻る</span>
                <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1 }}
                  />
                  <div className="absolute inset-0 bg-[url('/swirling-arcana.png')] opacity-10" />
              </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

