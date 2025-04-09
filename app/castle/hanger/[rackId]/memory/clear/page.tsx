"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Star, ChevronRight, ArrowLeft, Home } from "lucide-react"

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
  "すごい！やればできる！その勇気に祝福を送るモー！💪💖",
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

export default function StageClearPage() {
  const params = useParams()
  const router = useRouter()
  const rackId = params.rackId as string

  const [showTrophy, setShowTrophy] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [experiencePoints, setExperiencePoints] = useState(0)
  const [targetExperiencePoints, setTargetExperiencePoints] = useState(0)
  const [moChanComment, setMoChanComment] = useState("")
  const [showMoChan, setShowMoChan] = useState(false)
  const [sparkles, setSparkles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      delay: number
      type: "star" | "feather"
      rotation: number
    }>
  >([])

  // キラキラエフェクトを生成（星と羽）
  useEffect(() => {
    const newSparkles = []
    // 10個の星を生成
    for (let i = 0; i < 10; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100, // 画面の0%〜100%の範囲
        y: Math.random() * 100, // 画面の0%〜100%の範囲
        size: Math.random() * 20 + 15, // 15px〜35pxのサイズ
        delay: Math.random() * 3, // 0〜3秒の遅延
        type: "star",
        rotation: Math.random() * 360, // ランダムな回転角度
      })
    }

    // 8個の羽を生成
    for (let i = 10; i < 18; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100, // 画面の0%〜100%の範囲
        y: Math.random() * 100, // 画面の0%〜100%の範囲
        size: Math.random() * 25 + 20, // 20px〜45pxのサイズ
        delay: Math.random() * 3, // 0〜3秒の遅延
        type: "feather",
        rotation: Math.random() * 360, // ランダムな回転角度
      })
    }
    setSparkles(newSparkles)
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

    // モーちゃんを表示
    const moChanTimer = setTimeout(() => {
      setShowMoChan(true)
      // ランダムなコメントを選択
      const randomIndex = Math.floor(Math.random() * moChanComments.length)
      setMoChanComment(moChanComments[randomIndex])
    }, 1400)

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
      clearTimeout(moChanTimer)
      clearTimeout(buttonsTimer)
      clearTimeout(expTimer)
    }
  }, [])

  // 次のステージに進む
  const goToNextStage = () => {
    router.push(`/castle/hanger/${rackId}/clear`)
  }

  // 経験値を獲得
  const getExperiencePoints = () => {
    // 実際のアプリでは経験値をデータベースに保存する処理を行います
    alert(`${experiencePoints}ポイントの経験値を獲得しました！`)
  }

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-900/90 before:to-[#5c1a33]/90">
      {/* ナビゲーションリンク */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href={`/castle/hanger/${rackId}`}
          className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors bg-blue-900/50 px-3 py-2 rounded-md"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>ダンジョンマップに戻る</span>
        </Link>
      </div>

      {/* クローゼット城に戻るボタン（右上） */}
      <div className="absolute top-8 right-8 z-20">
        <Link
          href="/castle"
          className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors bg-blue-900/50 px-3 py-2 rounded-md"
        >
          <Home className="mr-2 h-5 w-5" />
          <span>クローゼット城に戻る</span>
        </Link>
      </div>

      {/* キラキラエフェクト（星と羽） */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 0, rotate: sparkle.rotation }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
              y: sparkle.type === "feather" ? [0, 20, 40] : undefined, // 羽は下に落ちるように
              rotate:
                sparkle.type === "feather"
                  ? [sparkle.rotation, sparkle.rotation + 20, sparkle.rotation + 40]
                  : undefined, // 羽は回転
            }}
            transition={{
              duration: sparkle.type === "feather" ? 3 : 2, // 羽はゆっくり
              delay: sparkle.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: Math.random() * 4 + 1,
            }}
            className="absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              fontSize: `${sparkle.size}px`,
              color: sparkle.type === "star" ? "#FCD34D" : "#F9FAFB", // 星は黄色、羽は白
              textShadow: sparkle.type === "star" ? "0 0 10px rgba(251,191,36,0.8)" : "0 0 8px rgba(255,255,255,0.6)",
            }}
          >
            {sparkle.type === "star" ? "✨" : "❃"}
          </motion.div>
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
                  <BookOpen className="w-32 h-32" />
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
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300"
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
                冒険の記録を保存！
              </motion.h1>

              {/* モーちゃん */}
              <AnimatePresence>
                {showMoChan && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
                    className="mt-6 flex flex-col items-center"
                  >
                    <div className="relative w-24 h-24 mb-3">
                      <div className="absolute inset-0 rounded-full bg-lime-400 transform scale-[1.08]" />
                      <div className="absolute inset-0 overflow-hidden rounded-full">
                        <Image
                          src="/cow-fairy.webp"
                          alt="モーちゃん"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <motion.div
                        className="absolute -inset-1"
                        animate={{
                          boxShadow: [
                            "0 0 8px 2px rgba(132,204,22,0.4)",
                            "0 0 12px 4px rgba(132,204,22,0.6)",
                            "0 0 8px 2px rgba(132,204,22,0.4)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                    </div>

                    <motion.div
                      className="text-xl text-amber-400 font-medium max-w-md bg-purple-900/50 p-4 rounded-xl border border-amber-400/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <p className="mb-2">{moChanComment}</p>
                      <p className="text-amber-400 font-bold">さぁ、偉大なる勇者よ、最終章へ進むのだ・・</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                <span className="relative z-10">最終章に進む</span>
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
