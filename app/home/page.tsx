"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, User, LogOut, Scroll, Info, Footprints, Settings, Castle, Mountain, Trees, Home, BookOpen } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { MedievalSharp } from "next/font/google"

const medievalSharp = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
})

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [currentQuest, setCurrentQuest] = useState("Dairy Mission：")

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/home.mp3")
    audioElement.loop = true
    audioElement.volume = 0.7
    audioElement.preload = "auto" // プリロードを設定
    setAudio(audioElement)

    // 初期状態では再生を試みない
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ""
      }
    }
  }, [])

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    if (audio) {
      audio.muted = isMuted

      // ミュート解除時に再生を試みる
      if (!isMuted && audio.paused) {
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Play on unmute failed:", error)
            // エラーが発生した場合、ユーザーに通知
            toast({
              title: "音楽の再生",
              description: "画面をタップすると音楽が再生されます",
              duration: 3000,
            })
          })
        }
      }
    }
  }, [isMuted, audio])

  // 画面タップで再生を試みる関数
  const tryPlayAudio = useCallback(() => {
    if (audio && audio.paused && !isMuted) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Play on screen tap failed:", error)
          toast({
            title: "音楽の再生",
            description: "ブラウザの設定で音声の自動再生が制限されている可能性があります",
            duration: 5000,
          })
        })
      }
    }
  }, [audio, isMuted])

  // 初回レンダリング時にユーザーに通知
  useEffect(() => {
    const showAudioNotification = () => {
      toast({
        title: "🎵 音楽の再生",
        description: "画面をタップすると音楽が再生されます。音量にご注意ください。",
        duration: 7000,
      })
    }
    
    // 少し遅延させて通知を表示
    const timer = setTimeout(showAudioNotification, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="min-h-screen w-full bg-[url('/map.png')] bg-cover bg-center text-amber-300 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-green-900/80" />
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <h1 className={cn("text-2xl sm:text-4xl font-bold text-[#f0c96b] drop-shadow-[0_0_5px_rgba(240,201,107,0.7)] px-2", medievalSharp.className)}>
          Closet Chronicle
        </h1>
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Link href="/settings">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Current Quest Bar */}
      <div className="bg-gradient-to-r from-teal-800 via-purple-800 to-teal-800 border-b-2 border-yellow-500 p-2 px-4 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center space-x-2">
          <Scroll className="h-5 w-5 text-yellow-300" />
          <span className="text-[#f0c96b] font-bold text-sm sm:text-base drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">
            {currentQuest}
          </span>
        </div>
        <div className="flex items-center">
          <Link href="/dailymission">
            <div className="relative group">
              <Button
                className="bg-[#f0c96b] hover:bg-[#d0a54b] text-green-900 drop-shadow-[0_0_5px_rgba(240,201,107,0.7)] font-medium py-2 px-4 rounded-lg border border-[#d8b85a] text-sm shadow-lg transform hover:scale-105 transition-transform duration-200 flex items-center gap-2"
              >
                ミッションに挑戦！
              </Button>
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-64 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center border-2 border-[#f0c96b] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">
                  １日５分で終わるデイリーミッションに挑戦してみよう！
                </p>
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[16px] border-t-transparent border-b-transparent border-l-[#f0c96b]"></div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col relative">
        {/* Map area */}
        <div className="flex-1 p-3 relative">
          <div className="relative w-full h-[calc(100vh-8rem)]">
            {/* RPG Map Layout */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* 知識の湖 - 画面左上 */}
              <Link
                href="/lake"
                className="absolute top-[20%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10 group"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-800/90 rounded-full flex items-center justify-center shadow-lg border-4 border-[#f0c96b] drop-shadow-[0_0_5px_rgba(240,201,107,0.7)]">
                    <BookOpen className="w-8 h-8 text-[#f0c96b] drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-[#f0c96b]"></div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-28 bg-gradient-to-br from-blue-800/90 to-blue-900/90 backdrop-blur-sm rounded-lg p-2 text-center border-2 border-[#f0c96b]">
                    <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">収納の湖</p>
                  </div>
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center border-2 border-[#f0c96b] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">
                      収納に困ったら、収納の湖へ！他の勇者たちの収納Tipsを見れるよ✨
                    </p>
                    <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-r-[16px] border-t-transparent border-b-transparent border-r-[#f0c96b]"></div>
                  </div>
                </div>
              </Link>

              {/* パーティーの洞窟 - 画面右上 */}
              <Link
                href="/cave"
                className="absolute top-[20%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10 group"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-amber-800/90 rounded-full flex items-center justify-center shadow-lg border-4 border-[#f0c96b] drop-shadow-[0_0_5px_rgba(240,201,107,0.7)]">
                    <Mountain className="w-8 h-8 text-[#f0c96b] drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-[#f0c96b]"></div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-28 bg-gradient-to-br from-amber-800/90 to-amber-900/90 backdrop-blur-sm rounded-lg p-2 text-center border-2 border-[#f0c96b]">
                    <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">戦友達の洞窟</p>
                  </div>
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-64 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center border-2 border-[#f0c96b] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">
                      友達と、家族と、勇者仲間と。片付けの大冒険に出かけよう！
                    </p>
                    <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[16px] border-t-transparent border-b-transparent border-l-[#f0c96b]"></div>
                  </div>
                </div>
              </Link>

              {/* クローゼット城 - 画面中央 */}
              <Link
                href="/castle"
                className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10 group"
              >
                <div className="relative">
                  <div className="w-32 h-32 bg-violet-800/90 rounded-full flex items-center justify-center shadow-lg border-4 border-[#f0c96b] drop-shadow-[0_0_5px_rgba(240,201,107,0.7)]">
                    <Castle className="w-16 h-16 text-[#f0c96b] drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[32px] border-l-transparent border-r-transparent border-t-[#f0c96b]"></div>
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-40 bg-gradient-to-br from-violet-800/90 to-violet-900/90 backdrop-blur-sm rounded-lg p-2 text-center border-2 border-[#f0c96b]">
                    <p className="text-[#f0c96b] text-base font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">クローゼット城</p>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center border-2 border-[#f0c96b] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">
                      クローゼットの片づけを始めよう！
                    </p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-[#f0c96b]"></div>
                  </div>
                </div>
              </Link>

              {/* 審判の森 - 画面左下 */}
              <Link
                href="/forest"
                className="absolute top-[80%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10 group"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-teal-800/90 rounded-full flex items-center justify-center shadow-lg border-4 border-[#f0c96b] drop-shadow-[0_0_5px_rgba(240,201,107,0.7)]">
                    <Trees className="w-8 h-8 text-[#f0c96b] drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-[#f0c96b]"></div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-28 bg-gradient-to-br from-teal-800/90 to-teal-900/90 backdrop-blur-sm rounded-lg p-2 text-center border-2 border-[#f0c96b]">
                    <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">断捨離の森</p>
                  </div>
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center border-2 border-[#f0c96b] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">
                      片づけはまず断捨離から！断捨離のコツを知りたい時や、他の勇者に背中を押してもらいたい時は、断捨離の森へ！
                    </p>
                    <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-r-[16px] border-t-transparent border-b-transparent border-r-[#f0c96b]"></div>
                  </div>
                </div>
              </Link>

              {/* 勇者の家 - 画面右下 */}
              <Link
                href="/base"
                className="absolute top-[80%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10 group"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-pink-800/90 rounded-full flex items-center justify-center shadow-lg border-4 border-[#f0c96b] drop-shadow-[0_0_5px_rgba(240,201,107,0.7)]">
                    <Home className="w-8 h-8 text-[#f0c96b] drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]" />
                  </div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-28 bg-gradient-to-br from-pink-800/90 to-pink-900/90 backdrop-blur-sm rounded-lg p-2 text-center border-2 border-[#f0c96b]">
                    <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">勇者の休憩所</p>
                  </div>
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-64 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center border-2 border-[#f0c96b] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <p className="text-[#f0c96b] text-sm font-bold drop-shadow-[0_0_3px_rgba(240,201,107,0.7)]">
                      疲れたら、休憩所で一服しよう✨これまでの冒険の軌跡や、今のステイタスが見れるよ！
                    </p>
                    <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[16px] border-t-transparent border-b-transparent border-l-[#f0c96b]"></div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* CSS for RPG elements */}
      <style jsx global>{`
        .rpg-nameplate {
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid #ffd700;
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
          min-width: 80px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

