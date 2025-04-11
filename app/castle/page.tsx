"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import { Crown, Package, Shirt, Layers, Sparkles, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CastleLobbyPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen w-full bg-[url('/castle.png')] bg-cover bg-center text-amber-300 flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-green-950/80">
      {/* ホームに戻るボタン */}
      <Link href="/home" className="absolute top-4 right-4 z-20">
        <Button variant="outline" className="bg-green-900/80 border-amber-500/50 text-amber-300 hover:bg-green-800/90 hover:text-amber-200">
          <Home className="w-4 h-4 mr-2" />
          ホームに戻る
        </Button>
      </Link>
      {/* Magical floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
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

      {/* Torch light effects */}
      <div className="absolute left-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"></div>
      <div
        className="absolute right-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute left-1/3 bottom-1/4 w-24 h-24 rounded-full bg-green-500/20 blur-2xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute right-1/3 bottom-1/4 w-24 h-24 rounded-full bg-green-500/20 blur-2xl animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>

      {/* Ancient rune circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[800px] h-[800px] border-2 border-amber-600/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[700px] h-[700px] border border-amber-600/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] border border-green-600/10 rounded-full"
          animate={{ rotate: 180 }}
          transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      <motion.div
        className="relative z-10 mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative inline-block">
          {/* Sparkle effects */}
          <motion.div
            className="absolute -top-6 -left-6 text-amber-300 opacity-70"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
              rotate: [0, 15, 0],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <Sparkles size={24} />
          </motion.div>
          <motion.div
            className="absolute -top-4 -right-6 text-amber-300 opacity-70"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
              rotate: [0, -15, 0],
            }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
          >
            <Sparkles size={20} />
          </motion.div>
          <motion.div
            className="absolute -bottom-6 -right-8 text-amber-300 opacity-70"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
              rotate: [0, 20, 0],
            }}
            transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 }}
          >
            <Sparkles size={22} />
          </motion.div>
          <motion.div
            className="absolute -bottom-4 -left-8 text-amber-300 opacity-70"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
              rotate: [0, -20, 0],
            }}
            transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1.5 }}
          >
            <Sparkles size={18} />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wider relative inline-block">
            <motion.span
              className="relative text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300"
              animate={{
                backgroundPosition: ["0% center", "100% center", "0% center"],
                textShadow: [
                  "0 0 7px rgba(251,191,36,0.6), 0 0 10px rgba(251,191,36,0.4), 0 0 21px rgba(251,191,36,0.2), 0 0 42px rgba(251,191,36,0.1)",
                  "0 0 10px rgba(251,191,36,0.8), 0 0 15px rgba(251,191,36,0.6), 0 0 25px rgba(251,191,36,0.4), 0 0 45px rgba(251,191,36,0.2)",
                  "0 0 7px rgba(251,191,36,0.6), 0 0 10px rgba(251,191,36,0.4), 0 0 21px rgba(251,191,36,0.2), 0 0 42px rgba(251,191,36,0.1)",
                ],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              style={{ backgroundSize: "200% auto" }}
            >
              クローゼット城
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                animate={{ opacity: [0.5, 1, 0.5], width: ["80%", "100%", "80%"] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                style={{ left: "50%", transform: "translateX(-50%)" }}
              />
            </motion.span>
          </h1>
        </div>
        <p className="text-xl text-amber-300/80 mt-4 font-medium tracking-wide">
          「収納の間」を選び、古代の魔法を解き放て
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16 z-10">
        <RoomCard
          title="ハンガーラック収納の間"
          icon={<Shirt className="w-12 h-12" />}
          isActive={true}
          count={0}
          href="/castle/hanger"
          delay={0.6}
        />

        <RoomCard
          title="棚収納の間"
          icon={<Package className="w-12 h-12" />}
          isActive={false}
          count={0}
          href="#"
          delay={0.8}
        />

        <RoomCard
          title="引き出し収納の間"
          icon={<Layers className="w-12 h-12" />}
          isActive={false}
          count={0}
          href="#"
          delay={1.0}
        />
      </div>
    </div>
  )
}

interface RoomCardProps {
  title: string
  icon: React.ReactNode
  isActive: boolean
  count: number
  href: string
  delay: number
}

function RoomCard({ title, icon, isActive, count, href, delay }: RoomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={isActive ? { y: -5 } : {}}
    >
      <Link href={isActive ? href : "#"} className="block">
        <Card
          className={`relative p-6 h-[280px] flex flex-col items-center justify-center text-center transition-all duration-300 overflow-hidden
          ${
            isActive
              ? "bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
              : "bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-2 border-slate-700/50 opacity-70"
          }`}
        >
          {/* Decorative corners */}
          <div
            className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${isActive ? "border-amber-500" : "border-slate-600"}`}
          ></div>
          <div
            className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${isActive ? "border-amber-500" : "border-slate-600"}`}
          ></div>
          <div
            className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${isActive ? "border-amber-500" : "border-slate-600"}`}
          ></div>
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${isActive ? "border-amber-500" : "border-slate-600"}`}
          ></div>

          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"
              animate={{ opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />
          )}

          <div className="mb-4 relative">
            <motion.div
              className={`relative z-10 ${isActive ? "text-amber-400" : "text-slate-400"}`}
              animate={
                isActive
                  ? {
                      filter: [
                        "drop-shadow(0 0 2px rgba(251,191,36,0.5))",
                        "drop-shadow(0 0 5px rgba(251,191,36,0.7))",
                        "drop-shadow(0 0 2px rgba(251,191,36,0.5))",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {icon}
            </motion.div>
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full z-0"
                animate={{
                  boxShadow: [
                    "0 0 5px 2px rgba(251,191,36,0.2)",
                    "0 0 10px 5px rgba(251,191,36,0.3)",
                    "0 0 5px 2px rgba(251,191,36,0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
              />
            )}
          </div>

          <h3 className={`text-xl font-bold mb-3 tracking-wide ${isActive ? "text-amber-400" : "text-slate-400"}`}>
            {title}
          </h3>
          {!isActive && (
            <div className="text-slate-400 text-sm mt-2">準備中</div>
          )}
        </Card>
      </Link>
    </motion.div>
  )
}

