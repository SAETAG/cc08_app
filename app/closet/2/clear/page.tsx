"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Home, Trophy, ArrowRight, Scroll, Star } from "lucide-react"

export default function Stage2ClearPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [showConfetti, setShowConfetti] = useState(true)
  const [showItemAnimation, setShowItemAnimation] = useState(false)
  const [showExpAnimation, setShowExpAnimation] = useState(false)

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/stepclear.mp3")
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

  // Hide confetti after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Handle item get
  const handleGetItem = async () => {
    setShowItemAnimation(true)
    setTimeout(() => {
      setShowItemAnimation(false)
    }, 1500)

    try {
      const response = await fetch("/api/updateItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: "CHAOS_CRYSTAL" // 混沌の結晶
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const result = await response.json();
      console.log("Item update result:", result);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  // Handle exp item get
  const handleGetExp = async () => {
    setShowExpAnimation(true)
    setTimeout(() => {
      setShowExpAnimation(false)
    }, 1500)

    try {
      // Player Data (Title)のEXPを更新
      const expResponse = await fetch("/api/updateExp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!expResponse.ok) {
        throw new Error("Failed to update EXP");
      }

      const expResult = await expResponse.json();
      console.log("EXP update result:", expResult);

      // Statistics APIを呼び出して統計情報を更新
      console.log("Calling updateStatistics API...");
      const statsResponse = await fetch("/api/updateStatistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // セッションクッキーを送信するために必要
      });

      console.log("updateStatistics response status:", statsResponse.status);

      if (!statsResponse.ok) {
        const errorText = await statsResponse.text();
        console.error("Statistics API error response:", errorText);
        throw new Error(`Failed to update Statistics: ${statsResponse.status} ${errorText}`);
      }

      const statsResult = await statsResponse.json();
      console.log("Statistics update result:", statsResult);

      if (statsResult.result?.data?.updatedStatistics) {
        console.log("Updated statistics values:", {
          Experience: statsResult.result.data.updatedStatistics.find(s => s.StatisticName === "Experience")?.Value,
          DayExperience: statsResult.result.data.updatedStatistics.find(s => s.StatisticName === "DayExperience")?.Value,
          WeekExperience: statsResult.result.data.updatedStatistics.find(s => s.StatisticName === "WeekExperience")?.Value
        });
      } else {
        console.log("No statistics data in response");
      }
    } catch (error) {
      console.error("Error updating EXP or Statistics:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
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
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-2 sm:p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
            ステージクリア！
          </h1>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />}
          </Button>
          <Link href="/home">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                top: "-5%",
                left: `${Math.random() * 100}%`,
                width: `${5 + Math.random() * 10}px`,
                height: `${10 + Math.random() * 15}px`,
                background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        <div className="max-w-2xl w-full bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-3 sm:p-6 border-2 border-yellow-500 shadow-lg text-center">
          {/* Trophy icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 animate-bounce-slow">
              <Trophy className="w-full h-full text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-3 sm:mb-4 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
            ステージクリア！
          </h1>

          <p className="text-white text-base sm:text-lg md:text-xl mb-4 sm:mb-6">
            おめでとうございます！「選別の祭壇」ステージをクリアしました。
            <br />
            あなたは自分のクローゼットの現状と理想を明確にしました。
          </p>

          <div className="bg-teal-800 bg-opacity-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-left">
            <h2 className="text-lg sm:text-xl font-bold text-yellow-300 mb-2">獲得したアイテム</h2>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div
                className="bg-purple-900 bg-opacity-50 p-2 sm:p-3 rounded border border-yellow-500 flex items-center animate-fade-in relative"
                style={{ animationDelay: "0.5s" }}
              >
                {showItemAnimation && (
                  <div className="animate-float-up text-amber-400 font-bold text-lg sm:text-xl left-1/2 top-0 transform -translate-x-1/2">
                    アイテムゲット！
                  </div>
                )}
                <div className="mr-2 sm:mr-3">
                  <Scroll className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300" />
                </div>
                <div className="flex-1">
                  <p className="text-yellow-300 font-bold text-sm sm:text-base">混沌の結晶</p>
                  <p className="text-white text-xs sm:text-sm">クローゼット整理の重要な道具</p>
                </div>
                <Button
                  onClick={handleGetItem}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-purple-900 font-bold text-xs sm:text-sm"
                  size="sm"
                >
                  アイテムをゲットする
                </Button>
              </div>

              <div
                className="bg-purple-900 bg-opacity-50 p-2 sm:p-3 rounded border border-yellow-500 flex items-center animate-fade-in relative"
                style={{ animationDelay: "1s" }}
              >
                {showExpAnimation && (
                  <div className="animate-float-up text-green-300 font-bold text-lg sm:text-xl left-1/2 top-0 transform -translate-x-1/2">
                    ＋50EXP！
                  </div>
                )}
                <div className="mr-2 sm:mr-3">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300" />
                </div>
                <div className="flex-1">
                  <p className="text-yellow-300 font-bold text-sm sm:text-base">経験値50ポイント</p>
                  <p className="text-white text-xs sm:text-sm">クローゼット整理の第一歩を踏み出した証</p>
                </div>
                <Button
                  onClick={handleGetExp}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-purple-900 font-bold text-xs sm:text-sm"
                  size="sm"
                >
                  経験値をゲットする
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/closet">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg border border-blue-400 shadow-lg text-sm sm:text-base"
                onClick={tryPlayAudio}
              >
                マップに戻る
              </Button>
            </Link>

            <Link href="/closet/3">
              <Button
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center gap-2 border border-green-400 shadow-lg text-sm sm:text-base"
                onClick={tryPlayAudio}
              >
                次のステージへ
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        @keyframes confetti {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 5s linear forwards;
        }
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(20px); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-40px); }
        }
        .animate-float-up {
          animation: floatUp 1.5s ease-out forwards;
          position: absolute;
          z-index: 20;
        }
      `}</style>
    </div>
  )
}

