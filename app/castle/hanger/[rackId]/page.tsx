"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Star, Lock, ChevronRight, Trophy, Shirt, Sparkles, Home } from "lucide-react"

// ステップの型定義
interface Step {
  id: string
  title: string
  description: string
  isCompleted: boolean
  reward?: number // 報酬ポイント
}

// ハンガーラックの型定義
interface HangerRack {
  id: string
  name: string
  image: string
  steps: Step[]
  progress: number // 進行度（%）
}

// モックデータ - 実際のアプリではFirestoreから取得
const getMockHangerData = (id: string): HangerRack => {
  return {
    id,
    name: id === "1" ? "寝室クローゼットのハンガーラック" : "リビング収納のハンガーポール",
    image: id === "1" ? "/organized-walk-in-closet.png" : "/clothes-rack-with-assorted-clothing.png",
    steps: [
      {
        id: "step1",
        title: "混沌の洞窟",
        description: "",
        isCompleted: true,
        reward: 50,
      },
      {
        id: "step2",
        title: "分類の神殿",
        description: "",
        isCompleted: true,
        reward: 70,
      },
      {
        id: "step3",
        title: "季節の迷宮",
        description: "",
        isCompleted: false,
        reward: 80,
      },
      {
        id: "step4",
        title: "統一の回廊",
        description: "",
        isCompleted: false,
        reward: 60,
      },
      {
        id: "step5",
        title: "虹色の塔",
        description: "",
        isCompleted: false,
        reward: 90,
      },
      {
        id: "step6",
        title: "記録の祭壇",
        description: "",
        isCompleted: false,
        reward: 100,
      },
    ],
    progress: 33, // 2/6 = 約33%
  }
}

// レベルに応じた背景色のグラデーションを取得する関数
const getLevelGradient = (level: number, isCompleted: boolean, isCurrent: boolean, isLocked: boolean) => {
  if (isLocked) {
    return "from-slate-800/90 to-slate-900/90"
  }

  if (isCompleted || isCurrent) {
    switch (level) {
      case 1:
        return "from-blue-700/90 to-blue-800/90"
      case 2:
        return "from-blue-600/90 to-blue-700/90"
      case 3:
        return "from-indigo-600/90 to-indigo-700/90"
      case 4:
        return "from-purple-600/90 to-purple-700/90"
      case 5:
        return "from-purple-500/90 to-purple-600/90"
      case 6:
        return "from-green-600/90 to-green-700/90"
      default:
        return "from-amber-500/90 to-amber-600/90"
    }
  }

  return "from-slate-800/90 to-slate-900/90"
}

// レベルに応じたボーダー色を取得する関数
const getLevelBorder = (level: number, isCompleted: boolean, isCurrent: boolean, isLocked: boolean) => {
  if (isLocked) {
    return "border-slate-700/50"
  }

  if (isCompleted || isCurrent) {
    switch (level) {
      case 1:
        return "border-blue-500/50"
      case 2:
        return "border-blue-400/50"
      case 3:
        return "border-indigo-400/50"
      case 4:
        return "border-purple-400/50"
      case 5:
        return "border-purple-300/50"
      case 6:
        return "border-green-500/50"
      default:
        return "border-amber-500/50"
    }
  }

  return "border-slate-700/50"
}

// レベルに応じたレベル表示の背景色を取得する関数
const getLevelBadgeColor = (level: number, isCompleted: boolean, isCurrent: boolean, isLocked: boolean) => {
  if (isLocked) {
    return "bg-slate-700"
  }

  if (isCompleted || isCurrent) {
    switch (level) {
      case 1:
        return "bg-blue-600"
      case 2:
        return "bg-blue-500"
      case 3:
        return "bg-indigo-500"
      case 4:
        return "bg-purple-500"
      case 5:
        return "bg-purple-400"
      case 6:
        return "bg-green-500"
      default:
        return "bg-amber-500"
    }
  }

  return "bg-slate-700"
}

export default function HangerDungeonPage() {
  const params = useParams()
  const router = useRouter()
  const rackId = params.rackId as string

  const [hangerData, setHangerData] = useState<HangerRack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    // 実際のアプリではFirestoreからデータを取得
    // const fetchHangerData = async () => {
    //   const hangerDoc = await getDoc(doc(db, "hangers", rackId))
    //   if (hangerDoc.exists()) {
    //     setHangerData(hangerDoc.data() as HangerRack)
    //   }
    //   setIsLoading(false)
    // }
    // fetchHangerData()

    // モックデータを使用
    setTimeout(() => {
      const data = getMockHangerData(rackId)
      setHangerData(data)

      // 現在のステップインデックスを計算（最初の未完了ステップ）
      const currentIndex = data.steps.findIndex((step) => !step.isCompleted)
      setCurrentStepIndex(currentIndex !== -1 ? currentIndex : data.steps.length)

      setIsLoading(false)
    }, 1000)
  }, [rackId])

  const handleStepClick = (stepIndex: number, stepId: string) => {
    // 完了済みのステップか現在のステップのみクリック可能
    if (stepIndex <= currentStepIndex) {
      router.push(`/castle/hanger/${rackId}/${stepId}`)
    }
  }

  if (isLoading || !hangerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-950 text-amber-300">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mb-4"
          >
            <Sparkles className="h-12 w-12 text-amber-400" />
          </motion.div>
          <p className="text-xl">ダンジョンマップを読み込み中...</p>
        </div>
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

      <div className="w-full max-w-5xl z-10 mt-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/closet/hanger/register"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>ハンガーラック一覧に戻る</span>
          </Link>

          <Link
            href="/castle"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            <span>クローゼット城に戻る</span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shirt className="h-6 w-6 text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400 tracking-wider">{hangerData.name}</h1>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg text-amber-300/80">整理収納の冒険を進めましょう</p>

            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-medium">進行度:</span>
              <div className="w-32 h-3 bg-blue-900/50 rounded-full overflow-hidden border border-amber-500/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${hangerData.progress}%` }}
                  transition={{ type: "spring", bounce: 0.2, duration: 1 }}
                />
              </div>
              <span className="text-amber-300 font-medium">{hangerData.progress}%</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <Card className="relative overflow-hidden bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-4">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

              <div className="relative aspect-square w-full overflow-hidden rounded-md">
                <Image
                  src={hangerData.image || "/placeholder.svg"}
                  alt={hangerData.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <span className="text-amber-300 font-medium">クリア報酬</span>
                  </div>
                  <p className="text-amber-300/90 text-sm">
                    全ステップをクリアすると、特別な魔法のアイテムと収納スキルが手に入ります！
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="relative overflow-hidden bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

              <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                整理収納ダンジョン
              </h2>

              {/* ダンジョンカードのグリッド */}
              <div className="grid grid-cols-1 gap-4">
                {hangerData.steps.map((step, index) => {
                  // ステップの状態を判定
                  const isCompleted = step.isCompleted
                  const isCurrent = index === currentStepIndex
                  const isLocked = index > currentStepIndex
                  const level = index + 1

                  // レベルに応じたスタイルを取得
                  const bgGradient = getLevelGradient(level, isCompleted, isCurrent, isLocked)
                  const borderColor = getLevelBorder(level, isCompleted, isCurrent, isLocked)
                  const badgeColor = getLevelBadgeColor(level, isCompleted, isCurrent, isLocked)

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={!isLocked ? { y: -5 } : {}}
                      onClick={() => handleStepClick(index, step.id)}
                      className={`cursor-pointer ${isLocked ? "cursor-not-allowed" : ""}`}
                    >
                      <Card
                        className={`relative overflow-hidden bg-gradient-to-b ${bgGradient} border-2 ${borderColor} h-[100px] flex flex-row transition-all duration-300 ${
                          isLocked ? "opacity-70" : "shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                        }`}
                      >
                        {/* Decorative corners */}
                        <div
                          className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${isLocked ? "border-slate-600" : "border-amber-500"}`}
                        ></div>
                        <div
                          className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${isLocked ? "border-slate-600" : "border-amber-500"}`}
                        ></div>
                        <div
                          className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${isLocked ? "border-slate-600" : "border-amber-500"}`}
                        ></div>
                        <div
                          className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${isLocked ? "border-slate-600" : "border-amber-500"}`}
                        ></div>

                        {/* レベル表示（左側） */}
                        <div
                          className={`flex items-center justify-center ${badgeColor} w-[80px] h-full border-r-2 ${borderColor}`}
                        >
                          <div className="text-center">
                            <div className="text-xs text-white/80 font-medium mb-1">STAGE</div>
                            <div className="text-3xl font-bold text-white">{level}</div>
                          </div>
                        </div>

                        {/* メインコンテンツ */}
                        <div className="p-3 flex-1 flex flex-col justify-center relative">
                          <div className="flex items-center">
                            <h3
                              className={`text-xl font-bold ${
                                isCompleted ? "text-amber-400" : isCurrent ? "text-amber-300" : "text-slate-400"
                              }`}
                            >
                              {step.title}
                            </h3>
                          </div>

                          <div className="flex items-center mt-2">
                            {/* 報酬表示 */}
                            <div
                              className={`flex items-center gap-1 ${
                                isCompleted ? "text-amber-400" : "text-amber-300/60"
                              }`}
                            >
                              <Star className="h-4 w-4" />
                              <span className="text-sm font-medium">{step.reward} pts</span>
                            </div>
                          </div>

                          {/* ステータスアイコン（右側） */}
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isCompleted ? (
                              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                >
                                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                                </motion.div>
                              </div>
                            ) : isCurrent ? (
                              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <motion.div
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                >
                                  <ChevronRight className="h-10 w-10 text-amber-400" />
                                </motion.div>
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                                <Lock className="h-8 w-8 text-slate-500" />
                              </div>
                            )}
                          </div>

                          {/* 光るエフェクト（現在のステップ） */}
                          {isCurrent && (
                            <motion.div
                              className="absolute inset-0 z-0"
                              animate={{
                                boxShadow: [
                                  "inset 0 0 5px 2px rgba(251,191,36,0.1)",
                                  "inset 0 0 15px 5px rgba(251,191,36,0.2)",
                                  "inset 0 0 5px 2px rgba(251,191,36,0.1)",
                                ],
                              }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            />
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}

                {/* ゴール地点 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: hangerData.steps.length * 0.1 }}
                  whileHover={currentStepIndex >= hangerData.steps.length ? { y: -5 } : {}}
                  className={currentStepIndex >= hangerData.steps.length ? "cursor-pointer" : "cursor-not-allowed"}
                  onClick={() =>
                    currentStepIndex >= hangerData.steps.length && router.push(`/castle/hanger/${rackId}/complete`)
                  }
                >
                  <Card
                    className={`relative overflow-hidden bg-gradient-to-b ${
                      currentStepIndex >= hangerData.steps.length
                        ? "from-amber-500/90 to-amber-600/90 border-2 border-amber-300/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                        : "from-slate-700/90 to-slate-800/90 border-2 border-slate-600/50 opacity-70"
                    } h-[100px] flex flex-row transition-all duration-300`}
                  >
                    {/* Decorative corners */}
                    <div
                      className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
                        currentStepIndex >= hangerData.steps.length ? "border-amber-300" : "border-slate-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${
                        currentStepIndex >= hangerData.steps.length ? "border-amber-300" : "border-slate-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${
                        currentStepIndex >= hangerData.steps.length ? "border-amber-300" : "border-slate-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
                        currentStepIndex >= hangerData.steps.length ? "border-amber-300" : "border-slate-600"
                      }`}
                    ></div>

                    {/* ゴール表示（左側） */}
                    <div
                      className={`flex items-center justify-center ${
                        currentStepIndex >= hangerData.steps.length ? "bg-amber-500" : "bg-slate-700"
                      } w-[80px] h-full border-r-2 ${
                        currentStepIndex >= hangerData.steps.length ? "border-amber-300/50" : "border-slate-600/50"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xs text-white/80 font-medium mb-1">GOAL</div>
                        <Trophy
                          className={`h-8 w-8 ${
                            currentStepIndex >= hangerData.steps.length ? "text-white" : "text-slate-400"
                          } mx-auto`}
                        />
                      </div>
                    </div>

                    {/* メインコンテンツ */}
                    <div className="p-3 flex-1 flex flex-col justify-center relative">
                      <div className="flex items-center">
                        <h3
                          className={`text-xl font-bold ${
                            currentStepIndex >= hangerData.steps.length ? "text-amber-400" : "text-slate-400"
                          }`}
                        >
                          ダンジョンクリア！
                        </h3>
                      </div>

                      <div className="text-amber-300/90 text-sm mt-2">特別な報酬を獲得できます</div>

                      {/* ステータスアイコン（右側） */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {currentStepIndex >= hangerData.steps.length ? (
                          <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Trophy className="h-10 w-10 text-amber-400" />
                            </motion.div>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-slate-500" />
                          </div>
                        )}
                      </div>

                      {/* 光るエフェクト（クリア時） */}
                      {currentStepIndex >= hangerData.steps.length && (
                        <motion.div
                          className="absolute inset-0 z-0"
                          animate={{
                            boxShadow: [
                              "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                              "inset 0 0 20px 10px rgba(251,191,36,0.2)",
                              "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

