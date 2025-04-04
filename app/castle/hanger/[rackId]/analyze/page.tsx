"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, MessageCircle, Wand2, Loader2 } from "lucide-react"

// Mock data - replace with actual data fetching
const getHangerData = (id: string) => {
  return {
    id,
    name: id === "1" ? "寝室クローゼットのハンガーラック" : "リビング収納のハンガーポール",
    image: id === "1" ? "/organized-walk-in-closet.png" : "/clothes-rack-with-assorted-clothing.png",
  }
}

// Mock advice from Mo-chan
const getMoAdvice = () => {
  return [
    {
      type: "analysis",
      content:
        "現在のクローゼットは、色別に整理されていますが、スペースの活用が十分ではありません。また、季節外れの衣類が混在しているようです。",
    },
    {
      type: "advice",
      content: "1. 衣類を季節ごとにグループ化し、現在の季節のアイテムを手の届きやすい位置に配置しましょう。",
    },
    {
      type: "advice",
      content: "2. ハンガーの向きを統一すると、視覚的な整理感が増し、衣類を取り出しやすくなります。",
    },
    {
      type: "advice",
      content: "3. 使用頻度の低いアイテムは、収納ボックスに入れるか、クローゼットの上段に移動させましょう。",
    },
    {
      type: "advice",
      content: "4. 同じカテゴリーのアイテム（シャツ、パンツなど）をまとめることで、探しやすくなります。",
    },
    {
      type: "conclusion",
      content:
        "これらの改善を行うことで、クローゼットのスペースを最大30%効率化でき、日常の服選びがスムーズになります。",
    },
  ]
}

export default function HangerAnalyzePage() {
  const params = useParams()
  const router = useRouter()
  const rackId = params.rackId as string

  const [hangerData, setHangerData] = useState<any>(null)
  const [showAdvice, setShowAdvice] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [advice, setAdvice] = useState<any[]>([])
  const [typingIndex, setTypingIndex] = useState(0)
  const [isGeneratingDungeon, setIsGeneratingDungeon] = useState(false)

  useEffect(() => {
    // Simulate fetching data
    setHangerData(getHangerData(rackId))
  }, [rackId])

  const handleGetAdvice = () => {
    setIsLoading(true)
    setShowAdvice(false)

    // Simulate API call
    setTimeout(() => {
      const moAdvice = getMoAdvice()
      setAdvice(moAdvice)
      setIsLoading(false)
      setShowAdvice(true)
      setTypingIndex(0)
    }, 1500)
  }

  useEffect(() => {
    if (showAdvice && typingIndex < advice.length) {
      const timer = setTimeout(() => {
        setTypingIndex((prev) => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [showAdvice, typingIndex, advice.length])

  const handleGenerateDungeon = () => {
    setIsGeneratingDungeon(true)

    // Simulate dungeon generation
    setTimeout(() => {
      // In a real app, this would navigate to the generated dungeon
      router.push(`/castle/hanger/${rackId}/dungeon`)
    }, 2000)
  }

  if (!hangerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-950 text-amber-300">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">読み込み中...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[url('/abstract-geometric-shapes.png')] bg-cover bg-center text-amber-300 flex flex-col items-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
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

      <div className="w-full max-w-4xl z-10 mt-8">
        <Link
          href="/closet/hanger/register"
          className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>ハンガーラック一覧に戻る</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-amber-400 tracking-wider">{hangerData.name}</h1>
          <p className="text-lg text-amber-300/80">
            現状分析と整理収納アドバイスを取得して、クローゼットの冒険を最適化しましょう
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="relative overflow-hidden bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-4">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image src={hangerData.image || "/placeholder.svg"} alt={hangerData.name} fill className="object-cover" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex justify-center"
        >
          <Button
            onClick={handleGetAdvice}
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border border-amber-400/30 px-6 py-6 rounded-lg shadow-lg flex items-center gap-2 group transition-all duration-300 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-lg">アドバイスを取得中...</span>
              </>
            ) : (
              <>
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg">モーちゃんに現状分析と整理収納アドバイスをもらう</span>
              </>
            )}
          </Button>
        </motion.div>

        <AnimatePresence>
          {showAdvice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 overflow-hidden"
            >
              <Card className="bg-gradient-to-b from-blue-900/95 to-blue-950/95 border-2 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.3)] p-6 relative overflow-hidden">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

                <div className="flex items-start mb-6">
                  <div className="relative mr-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/50 relative">
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
                      <Sparkles className="h-3 w-3 text-blue-950" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-400 mb-1">モーちゃんからのアドバイス</h3>
                    <p className="text-amber-300/80 text-sm">魔法の整理収納アドバイザー</p>
                  </div>
                </div>

                <div className="space-y-4 pl-20">
                  {advice.slice(0, typingIndex).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${
                        item.type === "analysis"
                          ? "text-amber-300"
                          : item.type === "conclusion"
                            ? "text-amber-400 font-medium border-t border-amber-500/20 pt-4 mt-4"
                            : "text-amber-300/90"
                      }`}
                    >
                      {item.content}
                    </motion.div>
                  ))}

                  {typingIndex < advice.length && (
                    <div className="flex space-x-1 mt-2">
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                        className="h-2 w-2 bg-amber-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.2 }}
                        className="h-2 w-2 bg-amber-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.4 }}
                        className="h-2 w-2 bg-amber-400 rounded-full"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleGenerateDungeon}
            disabled={isGeneratingDungeon}
            className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white border border-purple-400/30 px-8 py-6 rounded-lg shadow-lg flex items-center gap-3 group transition-all duration-300 disabled:opacity-70"
          >
            {isGeneratingDungeon ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xl">ダンジョン生成中...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-6 w-6 group-hover:animate-pulse" />
                <span className="text-xl font-medium">ダンジョン生成</span>
                <motion.span
                  className="absolute -inset-1 opacity-0 group-hover:opacity-30 rounded-lg"
                  animate={{
                    boxShadow: [
                      "0 0 10px 5px rgba(168,85,247,0.2)",
                      "0 0 20px 10px rgba(168,85,247,0.4)",
                      "0 0 10px 5px rgba(168,85,247,0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

