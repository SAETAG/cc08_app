"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Home } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"

interface StepInfo {
  stepNumber: number
  dungeonName: string
  title: string
  description: string
  hint: string
  icon: string
}

export default function StepPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser } = useAuth()
  const [stepInfo, setStepInfo] = useState<StepInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStepInfo = async () => {
      try {
        const token = await currentUser?.getIdToken()
        if (!token) {
          throw new Error("認証情報が見つかりません")
        }

        const response = await fetch(`/api/racks/${params.rackId}/get`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("ステップ情報の取得に失敗しました")
        }

        const data = await response.json()
        
        // ステップ番号を取得（"step-1" から "1" を抽出）
        const stepNumber = parseInt(params.stepId.toString().replace("step-", ""))
        
        if (data.adventures && data.adventures.length > 0) {
          try {
            const parsedContent = JSON.parse(data.adventures[0].content)
            const stepData = parsedContent.steps.find((step: any) => step.stepNumber === stepNumber)
            
            if (stepData) {
              setStepInfo({
                stepNumber: stepData.stepNumber,
                dungeonName: stepData.dungeonName,
                title: stepData.title,
                description: stepData.description,
                hint: stepData.hint,
                icon: stepData.icon
              })
            } else {
              throw new Error("指定されたステップが見つかりません")
            }
          } catch (parseError) {
            console.error("JSONパースエラー:", parseError)
            throw new Error("ステップデータの解析に失敗しました")
          }
        } else {
          throw new Error("冒険データが見つかりません")
        }
      } catch (error) {
        console.error("Error fetching step info:", error)
        setError(error instanceof Error ? error.message : "エラーが発生しました")
      } finally {
        setLoading(false)
      }
    }

    fetchStepInfo()
  }, [params.rackId, params.stepId, currentUser])

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-violet-800/60">
        <div className="animate-spin text-4xl text-amber-400">🌟</div>
        <p className="mt-4 text-amber-400">読み込み中...</p>
      </div>
    )
  }

  if (error || !stepInfo) {
    return (
      <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-violet-800/60">
        <p className="text-red-400">{error || "データの取得に失敗しました"}</p>
        <button
          onClick={() => router.push(`/castle/hanger/${params.rackId}`)}
          className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
        >
          ダンジョンマップに戻る
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-violet-800/60">
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

      <div className="w-full max-w-4xl z-10 mt-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/castle/hanger/${params.rackId}`}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ステージ情報 */}
        <Card className="relative overflow-hidden bg-gradient-to-b from-violet-800/90 to-violet-900/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6">
          {/* 背景アイコン */}
          <div className="absolute top-0 right-0 opacity-10">
            <span className="text-[300px]">{stepInfo.icon}</span>
          </div>

          {/* 魔法城風の上部装飾 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-amber-400 to-yellow-200 rounded-full shadow-lg animate-pulse z-20"></div>

          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

          <div className="mb-4">
            <div className="text-sm text-amber-300/80 mb-1">STAGE {stepInfo.stepNumber}</div>
            <h1 className="text-3xl font-bold text-amber-400">{stepInfo.dungeonName}</h1>
          </div>

          <div className="space-y-4">
            {/* タイトル＋アイコン */}
            <div className="flex items-center text-xl font-semibold text-amber-300 mb-2 space-x-3">
              <span className="text-4xl">{stepInfo.icon}</span>
              <span>{stepInfo.title}</span>
            </div>

            {/* チェックリスト形式の説明 */}
            <ul className="list-disc list-inside text-amber-300/80 space-y-1">
              {stepInfo.description
                .split("✔️")
                .filter((item) => item.trim() !== "")
                .map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">✔️</span>
                    <span>{item.trim().replace(/\/$/, '')}</span>
                  </li>
                ))}
            </ul>

            {/* ヒントエリア */}
            <div className="relative">
              <div className="absolute -bottom-4 -left-4 w-16 h-16">
                <Image
                  src="/cow-fairy.webp"
                  alt="モーちゃん"
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-amber-500/50"
                />
              </div>
              <Card className="bg-gradient-to-r from-violet-800/90 to-violet-900/90 border-2 border-amber-500/30 p-6 pl-16">
                <p className="text-amber-300/80 italic">{stepInfo.hint}</p>
              </Card>
            </div>

            {/* ミッション完了ボタン */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch("/api/updateUserData", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        key: `rack_${params.rackId}_stage_${stepInfo.stepNumber}_status`,
                        value: true
                      }),
                    })

                    if (!response.ok) {
                      const error = await response.json()
                      throw new Error(error.error || "データの更新に失敗しました")
                    }

                    router.push(`/castle/hanger/${params.rackId}/${params.stepId}/clear`)
                  } catch (error) {
                    console.error("Error completing mission:", error)
                    alert(error instanceof Error ? error.message : "エラーが発生しました")
                  }
                }}
                className="relative overflow-hidden bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-amber-200 font-bold py-4 px-8 rounded-lg border-2 border-amber-200/50 transition-all duration-300 transform hover:scale-105 active:scale-98 group"
              >
                {/* 魔法陣パターンの背景 */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 to-cyan-400"></div>
                
                {/* ホバー時の光るエフェクト */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                {/* 内側に光るシャドウアニメーション */}
                <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_15px_rgba(251,191,36,0.3)] group-hover:shadow-[inset_0_0_20px_rgba(251,191,36,0.5)] transition-all duration-300"></div>
                
                <span className="relative z-10 flex items-center">
                  <span className="mr-2">✨</span>
                  ミッション完了！
                </span>
              </button>
            </div>
          </div>

          {/* 魔法城風の下部装飾 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-yellow-200 to-amber-400 rounded-full shadow-lg animate-pulse z-20"></div>
        </Card>
        </motion.div>
      </div>
    </div>
  )
}

