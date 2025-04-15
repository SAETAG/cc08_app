"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { X, Camera, ImageIcon, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface PostModalProps {
  open: boolean
  onClose: () => void
}

export function PostModal({ open, onClose }: PostModalProps) {
  const [step, setStep] = useState<"upload" | "generate" | "preview">("upload")
  const [image, setImage] = useState<string | null>(null)
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  if (!open) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setStep("generate")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateNames = () => {
    setIsGenerating(true)

    // Simulate AI name generation
    setTimeout(() => {
      setGeneratedNames(["忘却の古書", "時を超えた守護者の遺物", "賢者の記憶の断片", "迷いなき旅人の宝"])
      setIsGenerating(false)
    }, 1500)
  }

  const handleSelectName = (name: string) => {
    setSelectedName(name)
    setStep("preview")
  }

  const handleSubmit = () => {
    // Here you would submit the post to your backend
    console.log({
      image,
      name: selectedName,
      description,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-green-900/90 border border-amber-200/30 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-amber-100/80 hover:text-amber-200"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-serif text-amber-200 mb-4 text-center">
            {step === "upload" && "アイテムの写真をアップロード"}
            {step === "generate" && "RPG風の名前を生成"}
            {step === "preview" && "投稿内容を確認"}
          </h2>

          {step === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-amber-200/30 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-amber-200" />
                  </div>
                  <p className="text-amber-100">写真をアップロードしてください</p>
                  <div className="flex space-x-4">
                    <Button className="bg-amber-600 hover:bg-amber-500 text-white">
                      <Camera className="w-4 h-4 mr-2" />
                      カメラ
                    </Button>
                    <label className="cursor-pointer">
                      <Button className="bg-green-700 hover:bg-green-600 text-white">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        画像を選択
                      </Button>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "generate" && (
            <div className="space-y-4">
              {image && (
                <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden border-4 border-amber-200/30">
                  <Image src={image || "/placeholder.svg"} alt="アップロードされた画像" fill className="object-cover" />
                </div>
              )}

              {!isGenerating && generatedNames.length === 0 && (
                <div className="text-center">
                  <Button onClick={handleGenerateNames} className="bg-amber-600 hover:bg-amber-500 text-white">
                    <Wand2 className="w-4 h-4 mr-2" />
                    RPG風の名前を生成
                  </Button>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-amber-200 border-r-2 border-amber-200 border-b-2 border-transparent"></div>
                  <p className="text-amber-100 mt-2">名前を生成中...</p>
                </div>
              )}

              {!isGenerating && generatedNames.length > 0 && (
                <div className="space-y-3">
                  <p className="text-amber-100 text-center">名前を選んでください</p>
                  <div className="grid grid-cols-1 gap-2">
                    {generatedNames.map((name, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectName(name)}
                        className="p-3 border border-amber-200/30 rounded-full text-amber-200 hover:bg-green-800/50 transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleGenerateNames}
                    variant="outline"
                    className="w-full border-amber-200/30 text-amber-100"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    別の名前を生成
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              {image && (
                <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden border-4 border-amber-200/30">
                  <Image src={image || "/placeholder.svg"} alt="アップロードされた画像" fill className="object-cover" />
                </div>
              )}

              {selectedName && (
                <div className="text-center">
                  <h3 className="text-xl font-serif text-amber-200">{selectedName}</h3>
                </div>
              )}

              <div>
                <label className="block text-sm text-amber-100 mb-1">説明 (任意)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="このアイテムについて教えてください..."
                  className="bg-green-800/50 border-amber-200/30 text-amber-100 placeholder:text-amber-100/50"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={() => setStep("generate")}
                  variant="outline"
                  className="flex-1 border-amber-200/30 text-amber-100"
                >
                  戻る
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white">
                  投稿する
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
