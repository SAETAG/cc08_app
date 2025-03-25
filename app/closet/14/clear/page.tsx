"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Home, Crown, Volume2, VolumeX, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CrownPage() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [showCrown, setShowCrown] = useState(false)
  const [showFin, setShowFin] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  // 通知メッセージの状態
  const [showCrownMessage, setShowCrownMessage] = useState(false)
  const [showExpMessage, setShowExpMessage] = useState(false)

  // 音声のミュート切り替え
  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted
      setIsMuted(newMutedState)
      audioRef.current.muted = newMutedState

      // まだ再生されていなければ再生を試みる
      if (audioRef.current.paused) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error)
        })
      }
    }
  }

  // ホームに戻る
  const handleBackToHome = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    } catch (error) {
      console.error("Error stopping audio:", error)
    }

    router.push("/home")
  }

  // ページロード時のアニメーションシーケンス
  useEffect(() => {
    // 王冠のアニメーションを表示
    setTimeout(() => {
      setShowCrown(true)

      // 王冠表示後、FINの表示
      setTimeout(() => {
        setShowFin(true)

        // FIN表示後、ボタンの表示
        setTimeout(() => {
          setShowButtons(true)
        }, 2000)
      }, 3000)
    }, 1000)

    // オーディオの初期化
    const audio = new Audio("/crown.mp3")
    audio.loop = false // ループを無効化して一度だけ再生
    audio.volume = 0.7
    audioRef.current = audio

    // 自動再生
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error)
    })

    // クリーンアップ
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  // 通知メッセージを表示して自動的に消す
  const showNotification = (type: "crown" | "exp") => {
    if (type === "crown") {
      setShowCrownMessage(true)
      setTimeout(() => setShowCrownMessage(false), 2000)
    } else {
      setShowExpMessage(true)
      setTimeout(() => setShowExpMessage(false), 2000)
    }
  }

  // Handle exp get
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* 背景の光の効果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-purple-900/10 to-transparent"></div>

        {/* 背景の星や輝き */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-300"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out ${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* 紙吹雪のアニメーションを追加 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 紙吹雪のアニメーション - 50個の紙吹雪を生成 */}
        {Array.from({ length: 50 }).map((_, i) => {
          // ランダムな紙吹雪の種類（ハート、キラキラ、丸、四角など）
          const confettiTypes = ["❤️", "✨", "🎊", "🎉", "⭐", "💫", "🌟"]
          const confetti = confettiTypes[Math.floor(Math.random() * confettiTypes.length)]

          // ランダムな位置、サイズ、アニメーション時間
          const left = Math.random() * 100
          const size = Math.random() * 20 + 10
          const animationDuration = Math.random() * 5 + 3
          const animationDelay = Math.random() * 5

          return (
            <div
              key={i}
              className="absolute top-0 animate-confetti"
              style={{
                left: `${left}%`,
                fontSize: `${size}px`,
                animationDuration: `${animationDuration}s`,
                animationDelay: `${animationDelay}s`,
              }}
            >
              {confetti}
            </div>
          )
        })}
      </div>

      {/* 通知メッセージ - 王冠GET */}
      {showCrownMessage && (
        <div className="fixed top-1/3 left-0 right-0 z-50 flex justify-center animate-notification-appear">
          <div className="text-4xl font-bold text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]">王冠GET！</div>
        </div>
      )}

      {/* 通知メッセージ - EXP */}
      {showExpMessage && (
        <div className="fixed top-1/3 left-0 right-0 z-50 flex justify-center animate-notification-appear">
          <div className="text-4xl font-bold text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]">＋50EXP！</div>
        </div>
      )}

      {/* FIN表示 - 中央に配置 */}
      {showFin && (
        <div className="absolute inset-0 z-20 w-full h-full flex items-center justify-center animate-fin-sparkle">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">
            Closet Chronicle FIN
          </h1>
        </div>
      )}

      {/* 王冠のアニメーション - 中央に配置 */}
      {showCrown && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-crown-appear">
            <div className="relative">
              {/* 王冠の後ろの光の輪 */}
              <div className="absolute -inset-10 rounded-full bg-yellow-500/30 animate-pulse-slow"></div>

              {/* 王冠アイコン */}
              <Crown size={160} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />

              {/* 王冠の周りの光の粒子 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-sparkle"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 王冠の下のテキスト - 王冠とは別に配置 */}
      {showCrown && (
        <div
          className="absolute top-2/3 left-0 right-0 text-center animate-fade-in z-10"
          style={{ animationDelay: "1s" }}
        >
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">クローゼット王国の王冠</h2>
          <p className="text-yellow-100/80">あなたは正式にクローゼット王国の王となりました</p>
        </div>
      )}

      {/* ボタン配置 - 画面下部 */}
      {showButtons && (
        <div className="fixed bottom-10 left-0 right-0 z-30 flex flex-col items-center gap-4 animate-fade-in">
          {/* 横長の長方形ボタン - 横並び */}
          <div className="flex gap-3 justify-center">
            {/* 王冠を受け取るボタン */}
            <Button
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
              onClick={async () => {
                try {
                  const response = await fetch("/api/updateItem", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      itemName: "CLOSET_CROWN",
                    }),
                  })

                  if (!response.ok) {
                    throw new Error("Failed to update item")
                  }

                  // 成功時に通知メッセージを表示
                  showNotification("crown")
                } catch (error) {
                  console.error("Error updating item:", error)
                  alert("王冠の受け取りに失敗しました。もう一度お試しください。")
                }
              }}
            >
              <Crown className="h-5 w-5" />
              <span>王冠を受け取る</span>
            </Button>

            {/* 経験値を受け取るボタン */}
            <Button
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
              onClick={handleGetExp}
            >
              <Award className="h-5 w-5" />
              <span>経験値50EXPを受け取る</span>
            </Button>
          </div>

          {/* 小さい丸型のホームボタン - 下に配置 */}
          <Button
            onClick={handleBackToHome}
            className="rounded-full w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg flex items-center justify-center p-0 mt-2"
            aria-label="ホームに戻る"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* 音声コントロール - 右上に配置 */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={toggleMute}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg"
          aria-label={isMuted ? "ミュート解除" : "ミュート"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* アニメーション用のスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out forwards;
        }
        
        @keyframes crownAppear {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(20deg); opacity: 1; }
          80% { transform: scale(0.9) rotate(-10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        .animate-crown-appear {
          animation: crownAppear 2s forwards;
        }
        
        @keyframes sparkle {
          0%, 100% { box-shadow: 0 0 20px 10px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px 20px rgba(255, 215, 0, 0.6); }
        }
        
        .animate-sparkle {
          animation: sparkle 1.5s infinite ease-in-out;
        }
        
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 2s infinite ease-in-out;
        }
        
        @keyframes finAppear {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-fin-appear {
          animation: finAppear 2s forwards;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        .animate-confetti {
          animation: confetti-fall linear forwards;
        }

        @keyframes finSparkle {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.05); text-shadow: 0 0 20px rgba(245,158,11,0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-fin-sparkle {
          animation: finSparkle 2s forwards ease-out;
        }
        
        @keyframes notificationAppear {
          0% { opacity: 0; transform: translateY(-20px) scale(0.8); }
          20% { opacity: 1; transform: translateY(0) scale(1.2); }
          40% { transform: scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        
        .animate-notification-appear {
          animation: notificationAppear 2s forwards ease-out;
        }
      `}</style>
    </div>
  )
}

