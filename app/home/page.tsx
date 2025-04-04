"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, User, LogOut, Scroll, Info, Footprints, Settings } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [currentQuest, setCurrentQuest] = useState("今日のデイリーミッション：")

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/home.mp3")
    audioElement.loop = true
    audioElement.volume = 0.7
    setAudio(audioElement)

    try {
      audioElement.play().catch((error) => {
        console.log("Auto-play was prevented:", error)
      })
    } catch (error) {
      console.log("Audio play error:", error)
    }

    return () => {
      audioElement.pause()
      audioElement.src = ""
    }
  }, [])

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    if (audio) {
      audio.muted = isMuted

      // ミュート解除時に再生を試みる
      if (!isMuted && audio.paused) {
        try {
          audio.play().catch((error) => {
            console.log("Play on unmute failed:", error)
          })
        } catch (error) {
          console.log("Play error:", error)
        }
      }
    }
  }, [isMuted, audio])

  // 画面タップで再生を試みる関数
  const tryPlayAudio = () => {
    if (audio && audio.paused && !isMuted) {
      try {
        audio.play().catch((error) => {
          console.log("Play on screen tap failed:", error)
        })
      } catch (error) {
        console.log("Play error:", error)
      }
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col" onClick={tryPlayAudio}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <h1 className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
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
      <div className="bg-gradient-to-r from-teal-800 via-purple-800 to-teal-800 border-b-2 border-yellow-500 p-2 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <Scroll className="h-5 w-5 text-yellow-300" />
          <span className="text-yellow-300 font-bold text-sm sm:text-base drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]">
            {currentQuest}
          </span>
        </div>
        <Link href="/mountain">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm shadow-lg transform hover:scale-105 transition-transform duration-200 flex items-center gap-2 border-2 border-yellow-500"
          >
            ミッションをする✨！
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col relative">
        {/* Map area */}
        <div className="flex-1 p-3 relative">
          <div className="relative w-full h-[calc(100vh-8rem)] rounded-lg overflow-hidden border-2 border-purple-400 shadow-lg">
            {/* Map background */}
            <div className="absolute inset-0">
              <Image src="/map.png" alt="クローゼット王国の地図" fill className="object-cover" priority />
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-400 z-10"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-400 z-10"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-400 z-10"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-400 z-10"></div>

            {/* RPG Map Layout */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* 知識の湖 - 画面左上 */}
              <Link
                href="/lake"
                className="absolute top-[20%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10"
              >
                <div className="relative w-40 h-16 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg border-4 border-yellow-500 cursor-pointer flex items-center justify-center">
                  <p className="text-white text-base font-bold">知識の湖</p>
                </div>
              </Link>

              {/* パーティーの洞窟 - 画面右上 */}
              <Link
                href="/cave"
                className="absolute top-[20%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10"
              >
                <div className="relative w-40 h-16 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg border-4 border-yellow-500 cursor-pointer flex items-center justify-center">
                  <p className="text-white text-base font-bold">パーティーの洞窟</p>
                </div>
              </Link>

              {/* クローゼット城 - 画面中央 */}
              <Link
                href="/castle"
                className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10"
              >
                <div className="relative w-48 h-20 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg border-4 border-yellow-500 cursor-pointer flex items-center justify-center">
                  <p className="text-white text-lg font-bold">クローゼット城</p>
                </div>
              </Link>

              {/* 審判の森 - 画面左下 */}
              <Link
                href="/forest"
                className="absolute top-[80%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10"
              >
                <div className="relative w-40 h-16 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg border-4 border-yellow-500 cursor-pointer flex items-center justify-center">
                  <p className="text-white text-base font-bold">審判の森</p>
                </div>
              </Link>

              {/* モーモーショップ - 画面右下 */}
              <Link
                href="/shop"
                className="absolute top-[80%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10"
              >
                <div className="relative w-40 h-16 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg border-4 border-yellow-500 cursor-pointer flex items-center justify-center">
                  <p className="text-white text-base font-bold">勇者の家</p>
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

