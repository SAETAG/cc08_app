"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingBag, Coins, Sparkles, BookOpen, Home, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export default function ShopPage() {
  const router = useRouter()
  const [isSoundOn, setIsSoundOn] = useState(true)

  const handleConsultClick = () => {
    router.push("/shop/consult")
  }

  const handleHomeClick = () => {
    router.push("/home")
  }

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn)
    // ここにサウンド制御のロジックを追加できます
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-orange-950 text-white">
      {/* 右上のボタン */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 border-2 border-amber-400 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-amber-100 shadow-md transition-all hover:shadow-amber-400/30 hover:shadow-lg"
          onClick={handleHomeClick}
        >
          <Home className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 border-2 border-amber-400 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-amber-100 shadow-md transition-all hover:shadow-amber-400/30 hover:shadow-lg"
          onClick={toggleSound}
        >
          {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        .typewriter {
          animation: typing 2s steps(25);
          white-space: nowrap;
          overflow: hidden;
        }

        .font-pixel {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
      `}</style>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto border-4 border-amber-500 bg-gradient-to-br from-amber-900/80 to-orange-800/80 shadow-[0_0_15px_5px_rgba(245,158,11,0.3)] p-6 mt-16">
          <div className="flex flex-col items-center gap-6">
            {/* Mo-chan's image */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 animate-[float_3s_ease-in-out_infinite]">
              <div className="absolute inset-0 rounded-full border-4 border-amber-400 overflow-hidden bg-gradient-to-br from-amber-300 to-orange-400">
                <Image
                  src="/cow-fairy.webp"
                  alt="モーちゃん"
                  width={256}
                  height={256}
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Mo-chan's dialogue */}
            <div className="w-full max-w-2xl mb-8">
              <div className="relative bg-black/80 border-4 border-amber-500 rounded-lg p-5 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <div className="absolute -top-3 left-4 bg-black px-3 py-0.5 border-2 border-amber-500 text-amber-300 text-sm font-bold rounded-md">
                  モーちゃん
                </div>
                <p className="text-xl md:text-2xl font-pixel typewriter overflow-hidden whitespace-nowrap">
                  いらっしゃい。ご用件は何かな？
                </p>
                <div className="absolute bottom-2 right-3 animate-bounce text-amber-300 text-xl">▼</div>
              </div>
            </div>

            {/* Four buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <Button
                variant="outline"
                className="h-16 text-lg font-bold border-2 border-amber-400 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-amber-100 shadow-md transition-all hover:shadow-amber-400/30 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-6 h-6" />
                アイテムを買う
              </Button>

              <Button
                variant="outline"
                className="h-16 text-lg font-bold border-2 border-amber-400 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-amber-100 shadow-md transition-all hover:shadow-amber-400/30 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Coins className="w-6 h-6" />
                アイテムを売る
              </Button>

              <Button
                variant="outline"
                className="h-16 text-lg font-bold border-2 border-amber-400 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-amber-100 shadow-md transition-all hover:shadow-amber-400/30 hover:shadow-lg flex items-center justify-center gap-2"
                onClick={handleConsultClick}
              >
                <Sparkles className="w-6 h-6" />
                お片付け相談をする
              </Button>

              <Button
                variant="outline"
                className="h-16 text-lg font-bold border-2 border-amber-400 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-amber-100 shadow-md transition-all hover:shadow-amber-400/30 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <BookOpen className="w-6 h-6" />
                クローゼット王国について知る
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

