"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Home, CheckCircle, Lightbulb, Sparkles, Info } from "lucide-react"

export default function StepDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rackId = params.rackId as string
  const stepId = params.stepId as string

  const [isCompleting, setIsCompleting] = useState(false)

  // ステップ情報（実際のアプリではデータベースから取得）
  const stepInfo = {
    title: "ステップ１：いらない靴下を一つ捨てよう！",
    content:
      "クローゼットの整理は小さな一歩から始まります。まずは使わなくなった靴下、穴が開いた靴下、ペアを失った靴下など、一つでも不要なものを見つけて処分しましょう。\n\n小さなアイテムから始めることで、より大きな整理への自信がつきます。",
    hint: "靴下を広げて並べてみると、傷んでいるものや使わなくなったものが見つけやすくなります。色あせたものや、履き心地が悪くなったものも処分の候補です。",
  }

  const handleComplete = () => {
    setIsCompleting(true)

    // 実際のアプリではデータベースに完了状態を保存
    setTimeout(() => {
      router.push(`/castle/hanger/${rackId}/${stepId}/clear`)
    }, 1000)
  }

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
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

      <div className="w-full max-w-3xl z-10 mt-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/castle/hanger/${rackId}`}
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>ダンジョンマップに戻る</span>
          </Link>

          <Link
            href="/castle"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            <span>クローゼット城に戻る</span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-block relative">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400 tracking-wider">{stepInfo.title}</h1>
            <motion.div
              className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
              animate={{ opacity: [0.5, 1, 0.5], width: ["80%", "100%", "80%"] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              style={{ left: "50%", transform: "translateX(-50%)" }}
            />
          </div>
        </motion.div>

        <div className="flex flex-col gap-6 mb-8">
          {/* メインコンテンツ */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="relative overflow-hidden bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

              <div className="flex items-start mb-4">
                <Info className="h-6 w-6 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-bold text-amber-400">内容詳細</h2>
              </div>

              <div className="text-amber-300/90 leading-relaxed whitespace-pre-line pl-9">{stepInfo.content}</div>
            </Card>
          </motion.div>

          {/* ヒント（モーちゃんのセリフ） */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="relative mt-4 mb-2">
              {/* モーちゃんのキャラクター */}
              <div className="absolute left-4 top-6 z-10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/50">
                    <Image src="/cow-fairy.webp" alt="モーちゃん" fill className="object-cover" />
                  </div>
                  <motion.div
                    className="absolute -inset-1 rounded-full z-0"
                    animate={{
                      boxShadow: [
                        "0 0 5px 2px rgba(251,191,36,0.2)",
                        "0 0 10px 5px rgba(251,191,36,0.3)",
                        "0 0 5px 2px rgba(251,191,36,0.2)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.div
                    className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Lightbulb className="h-3 w-3 text-blue-950" />
                  </motion.div>
                </div>
              </div>

              {/* 吹き出し */}
              <div className="ml-16 pl-12 relative">
                {/* 吹き出しの三角形部分 */}
                <div
                  className="absolute left-0 top-10 w-0 h-0 
                  border-t-[12px] border-r-[24px] border-b-[12px] 
                  border-transparent border-r-amber-500/30"
                ></div>

                {/* 吹き出し本体 */}
                <div
                  className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 
                  rounded-2xl border-2 border-amber-500/30 p-5 relative overflow-hidden"
                >
                  {/* 装飾的な角 */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400/40"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400/40"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400/40"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400/40"></div>

                  {/* タイトル */}
                  <div className="flex items-center mb-3">
                    <h2 className="text-xl font-bold text-amber-400">モーちゃんからのヒント</h2>
                  </div>

                  {/* ヒント内容 */}
                  <div className="text-amber-300/90 leading-relaxed">{stepInfo.hint}</div>

                  {/* 光るエフェクト */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 完了ボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={handleComplete}
            disabled={isCompleting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xl font-medium py-4 px-12 rounded-lg shadow-lg border border-amber-400/30 relative overflow-hidden group flex items-center gap-3 disabled:opacity-70"
          >
            {isCompleting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
                <span className="relative z-10">完了処理中...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6" />
                <span className="relative z-10">完了！</span>
              </>
            )}
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
      </div>
    </div>
  )
}

