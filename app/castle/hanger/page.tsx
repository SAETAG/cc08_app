"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, PlayCircle, Shirt, Plus, Home } from "lucide-react"

const initialHangers = [
  { id: "1", name: "寝室クローゼットのハンガーラック", image: "/organized-walk-in-closet.png", stepsGenerated: true },
  { id: "2", name: "リビング収納のハンガーポール", image: "/clothes-rack-with-assorted-clothing.png", stepsGenerated: false },
]

export default function HangerListPage() {
  const [hangers, setHangers] = useState(initialHangers)
  const router = useRouter()

  const startAdventure = (hanger: { id: string; stepsGenerated: boolean }) => {
    if (hanger.stepsGenerated) {
      router.push(`/castle/hanger/${hanger.id}`)
    } else {
      router.push(`/castle/hanger/${hanger.id}/analyze`)
    }
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
            href="/castle"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>クローゼット城に戻る</span>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-amber-400 tracking-wider">
            あなたのハンガーラック一覧
          </h1>
          <p className="text-lg text-amber-300/80">登録済みのハンガーラックから冒険を始めましょう</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hangers.map((hanger, index) => (
            <motion.div
              key={hanger.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] h-[280px] flex flex-col">
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={hanger.image || "/placeholder.svg"}
                    alt={hanger.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent" />
                </div>

                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

                <div className="p-4 relative flex-1 flex flex-col">
                  <div className="flex items-center mb-2">
                    <Shirt className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-amber-400 truncate">{hanger.name}</h3>
                  </div>
                  <div className="text-sm text-amber-300/80 mb-3">
                    <span>{hanger.stepsGenerated ? "冒険中" : "まだ冒険していません"}</span>
                  </div>

                  <div className="mt-auto space-y-2">
                    <motion.button
                      onClick={() => startAdventure(hanger)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white py-1.5 px-3 rounded-md shadow-md border border-amber-400/30 flex items-center justify-center gap-1.5 group"
                    >
                      <PlayCircle className="h-4 w-4 group-hover:animate-pulse" />
                      <span>{hanger.stepsGenerated ? "冒険を再開する" : "冒険を始める"}</span>
                    </motion.button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hangers.length * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link href="/castle/hanger/register" className="block h-full">
              <Card className="relative overflow-hidden bg-gradient-to-b from-blue-900/80 to-blue-950/80 border-2 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)] h-[280px] cursor-pointer hover:border-amber-500/60 transition-all duration-300 flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

                <motion.div
                  className="mb-6 bg-blue-900/60 rounded-full p-4 text-amber-400"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(251,191,36,0.2)",
                      "0 0 15px rgba(251,191,36,0.4)",
                      "0 0 0 rgba(251,191,36,0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Plus className="h-10 w-10" />
                </motion.div>
                <h3 className="text-xl font-semibold text-amber-400 mb-3">新しいハンガーラックを登録する</h3>
                <p className="text-amber-300/70 text-sm">クリックして登録フォームを開く</p>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}