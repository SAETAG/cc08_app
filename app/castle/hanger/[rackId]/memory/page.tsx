"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Home, Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/contexts/AuthContext"

export default function MemoryPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser } = useAuth()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [afterimageUrl, setAfterimageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage || !currentUser) return

    setIsUploading(true)
    try {
      // Base64データをBlobに変換
      const base64Data = selectedImage.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512)
        const byteNumbers = new Array(slice.length)
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, { type: 'image/jpeg' })

      // FormDataを作成
      const formData = new FormData()
      formData.append('image', blob, 'after_image.jpg')
      formData.append('rackId', params.rackId as string)

      // 認証トークンを取得
      const token = await currentUser.getIdToken()

      // APIを呼び出し
      const response = await fetch(`/api/racks/${params.rackId}/updateafterimage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "画像のアップロードに失敗しました")
      }

      // PlayFabにデータを保存
      const playfabResponse = await fetch("/api/updateUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: `rack_${params.rackId}_memory_status`,
          value: true
        }),
      })

      if (!playfabResponse.ok) {
        const error = await playfabResponse.json()
        throw new Error(error.error || "データの更新に失敗しました")
      }

      // 成功したら自動的に次のページに遷移
      setAfterimageUrl(selectedImage)
      router.push(`/castle/hanger/${params.rackId}/memory/clear`)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert(error instanceof Error ? error.message : "エラーが発生しました")
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    const fetchAfterimage = async () => {
      try {
        const token = await currentUser.getIdToken()
        const response = await fetch(`/api/racks/${params.rackId}/getafterimage`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.afterimageUrl) {
          setAfterimageUrl(data.afterimageUrl)
        }
      } catch (error) {
        console.error('Error fetching afterimage:', error)
      }
    }

    fetchAfterimage()
  }, [params.rackId, currentUser])

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

      {/* Light effects */}
      <div className="absolute left-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"></div>
      <div
        className="absolute right-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="w-full max-w-5xl z-10 mt-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/castle/hanger/${params.rackId}`}
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>ハンガーラックに戻る</span>
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 tracking-wider mb-4">
            記憶の石碑
          </h1>
          <p className="text-lg text-amber-300/80">
            あなたの冒険の記録を残しましょう
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-[#800020]/90 via-[#4B0082]/90 to-[#800020]/90 border-2 border-amber-300/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6 max-w-sm mx-auto">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-300"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-300"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-300"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-300"></div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">
                片付け後の写真を登録しよう
              </h2>
              <p className="text-amber-300/80">
                冒険を終えて片付いたハンガーラックの写真を登録しよう
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="w-full max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-amber-400 mb-4">新しい写真の登録</h3>
                <div className="w-full aspect-[4/3] relative bg-blue-900/50 rounded-lg border-2 border-dashed border-amber-300/50 flex items-center justify-center">
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-amber-300/50">写真を選択してください</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="cursor-pointer group relative">
                  <div className="flex items-center justify-center gap-2 w-32 px-6 py-2.5 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500/90 hover:to-indigo-500/90 text-amber-200 rounded-lg transition-all duration-300 text-base border-2 border-amber-200/50 relative overflow-hidden transform hover:scale-105 active:scale-98">
                    <div className="absolute inset-0 bg-[url('/magic-circle.png')] bg-repeat opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/20 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                    <Upload className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">写真を選択</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                <label className="cursor-pointer group relative">
                  <div className="flex items-center justify-center gap-2 w-32 px-6 py-2.5 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 hover:from-blue-500/90 hover:to-cyan-500/90 text-amber-200 rounded-lg transition-all duration-300 text-base border-2 border-amber-200/50 relative overflow-hidden transform hover:scale-105 active:scale-98">
                    <div className="absolute inset-0 bg-[url('/magic-circle.png')] bg-repeat opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                    <Camera className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">{isUploading ? "登録中..." : "写真を登録"}</span>
                  </div>
                  <input
                    type="button"
                    className="hidden"
                    onClick={handleSubmit}
                    disabled={!selectedImage || isUploading || !currentUser}
                  />
                </label>
              </div>

              <div className="w-full max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-amber-400 mb-4">前回の記録</h3>
                <div className="w-full aspect-[4/3] relative bg-blue-900/50 rounded-lg border-2 border-dashed border-amber-300/50 flex items-center justify-center">
                  {afterimageUrl ? (
                    <Image
                      src={afterimageUrl}
                      alt="Afterimage"
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-gray-500 mb-4">画像が未登録です</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 