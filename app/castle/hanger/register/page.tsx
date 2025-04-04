"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Camera, X, ArrowLeft, Home } from "lucide-react"
import Image from "next/image"

export default function HangerRegisterPage() {
  const router = useRouter()
  const [newHangerName, setNewHangerName] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    alert("カメラ機能は実アプリで実装されます")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newHangerName.trim()) {
      alert("ハンガーラックの名前を入力してください")
      return
    }

    const newRackId = Date.now().toString() // 仮のID
    // Firestore に保存する処理をここに追加（省略）

    router.push(`/castle/hanger`)
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

      <div className="w-full max-w-2xl z-10 mt-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/castle/hanger"
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

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 tracking-wider">新しいハンガーラックを登録</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="relative overflow-hidden bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hanger-name" className="text-amber-300 text-lg">
                  ハンガーラックの名前
                </Label>
                <Input
                  id="hanger-name"
                  value={newHangerName}
                  onChange={(e) => setNewHangerName(e.target.value)}
                  required
                  placeholder="例：寝室クローゼットの左ハンガーラック"
                  className="bg-blue-950/50 border-amber-500/30 text-amber-100 placeholder:text-amber-300/40 focus:border-amber-400 focus:ring-amber-400/20 text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-amber-300 text-lg">画像</Label>
                {previewImage ? (
                  <div className="relative w-full h-64 border-2 border-dashed border-amber-500/30 rounded-md overflow-hidden">
                    <Image src={previewImage || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 bg-blue-950/70 text-amber-400 hover:text-amber-300 hover:bg-blue-900/80 p-2 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-md border-2 border-dashed border-amber-500/30 flex flex-col items-center justify-center p-4 bg-blue-950/30">
                    <Upload className="h-10 w-10 text-amber-400/60 mb-4" />
                    <p className="text-amber-300/80 text-center mb-6">
                      画像をアップロードするか、カメラで撮影してください
                    </p>
                    <div className="flex gap-4">
                      <motion.button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-800/80 hover:bg-blue-700/80 text-amber-300 border border-amber-500/30 py-2 px-4 rounded-md flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        アップロード
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleCameraCapture}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-800/80 hover:bg-blue-700/80 text-amber-300 border border-amber-500/30 py-2 px-4 rounded-md flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        カメラ
                      </motion.button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xl font-medium py-4 px-8 rounded-lg shadow-lg border border-amber-400/30 relative overflow-hidden group w-full"
                >
                  <span className="relative z-10">登録</span>
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
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

