"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Volume2, VolumeX, ArrowLeft, Home, Trash2 } from "lucide-react"

export default function Stage5BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [discardItems, setDiscardItems] = useState(Array(10).fill(false))
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Add a new state for showing the feedback card
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)
  const [goodPoints, setGoodPoints] = useState("")
  const [improvementPoints, setImprovementPoints] = useState("")

  const [unnecessaryFeatures, setUnnecessaryFeatures] = useState<string[]>([])
  const [desiredFeatures, setDesiredFeatures] = useState<string[]>([])
  const [otherFeedback, setOtherFeedback] = useState("")

  const [isClient, setIsClient] = useState(false)

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setIsClient(true)
  }, [])

  // シンプルな音声初期化 - クライアントサイドでのみ実行
  useEffect(() => {
    if (!isClient) return

    const audioElement = new Audio("/battle.mp3")
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
  }, [isClient])

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    if (!audio || !isClient) return

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
  }, [isMuted, audio, isClient])

  // 画面タップで再生を試みる関数
  const tryPlayAudio = () => {
    if (!audio || !isClient) return

    if (audio.paused && !isMuted) {
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

  // Toggle item discard
  const toggleDiscard = (index: number) => {
    const newDiscardItems = [...discardItems]
    newDiscardItems[index] = !newDiscardItems[index]
    setDiscardItems(newDiscardItems)

    // チェックボックス操作時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Check if at least 5 items are selected
  const atLeastFiveSelected = discardItems.filter(Boolean).length >= 5

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // APIエンドポイントにデータを送信
      const response = await fetch('/api/updateUserData', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stageId: 5
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save record');
      }

      // Navigate to clear page
      router.push("/closet/5/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col" onClick={isClient ? tryPlayAudio : undefined}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <Link href="/closet">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
              断捨離の審判 - 戦闘フェーズ
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Link href="/home">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center p-4 overflow-auto">
        <div className="max-w-2xl w-full bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">断捨離リストを「断捨離の箱」へ</h2>

          <p className="text-white mb-6 text-center">
            あなたに、真実を伝えよう。
            <br />
            今、「賢者の箱」に入っていないモノは全て、捨てるべきものだ。
            <br />
            さぁ、全てを「断捨離の箱」へ入れよう。
            <br />
            ただし、どうしても今別れを告げられないモノは「運命の箱」へ入れても良い。
            <br />
            他の場所へ移すべきものは「転送の箱」へ入れてしまおう。
          </p>

          {/* Discard checklist */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">断捨離の箱へ入れるべきリスト</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item1"
                  checked={discardItems[0]}
                  onCheckedChange={() => toggleDiscard(0)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item1" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">👕❌</span> 呪われし装備
                  </label>
                  <p className="text-white text-sm">色褪せたTシャツ、ヨレヨレの服、着るとなんかテンションが下がる服</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item2"
                  checked={discardItems[1]}
                  onCheckedChange={() => toggleDiscard(1)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item2" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">🧦💔</span> 朽ちた鎧
                  </label>
                  <p className="text-white text-sm">穴が空いた靴下、毛玉まみれのセーター、シミが落ちないシャツ</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item3"
                  checked={discardItems[2]}
                  onCheckedChange={() => toggleDiscard(2)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item3" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">👻👕</span> 幻影のローブ
                  </label>
                  <p className="text-white text-sm">
                    「いつか着るかも…」でずっと眠っている服は、もはや存在しないも同じ
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item4"
                  checked={discardItems[3]}
                  onCheckedChange={() => toggleDiscard(3)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item4" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">🏷️⚔️</span> 伝説になれなかった戦闘服
                  </label>
                  <p className="text-white text-sm">
                    試着室で「これ絶対着る！」と思ったのに、一度も外に出なかった勇者候補たち
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item5"
                  checked={discardItems[4]}
                  onCheckedChange={() => toggleDiscard(4)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item5" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">👎👚</span> 負のオーラを宿す鎧
                  </label>
                  <p className="text-white text-sm">
                    「痩せたら着る！」はもう呪文のようなもの。今の自分に合わない服は手放そう
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item6"
                  checked={discardItems[5]}
                  onCheckedChange={() => toggleDiscard(5)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item6" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">🌑🪶</span> 闇に染まった羽衣
                  </label>
                  <p className="text-white text-sm">
                    「昔はよく着てたけど、もう似合わない…」そんな服たちも、次の旅へ送り出そう
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item7"
                  checked={discardItems[6]}
                  onCheckedChange={() => toggleDiscard(6)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item7" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">🦸‍♂️🧣</span> かつての英雄のマント
                  </label>
                  <p className="text-white text-sm">
                    昔のバイトTシャツ、学生時代のジャージ…思い出は写真に残して服は処分！
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item8"
                  checked={discardItems[7]}
                  onCheckedChange={() => toggleDiscard(7)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item8" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">🤔👔</span> 迷いの装束
                  </label>
                  <p className="text-white text-sm">
                    「なんかしっくりこない」「着心地が悪い」→ 未来の自分も多分同じこと思う
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item9"
                  checked={discardItems[8]}
                  onCheckedChange={() => toggleDiscard(8)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item9" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">🧹⚖️</span> 重すぎる呪いの鎧
                  </label>
                  <p className="text-white text-sm">
                    毎回クリーニングが必要、アイロンが必須…メンテが面倒で着る気が起きない服
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 h-[120px]">
                <Checkbox
                  id="item10"
                  checked={discardItems[9]}
                  onCheckedChange={() => toggleDiscard(9)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6"
                />
                <div className="flex flex-col justify-center">
                  <label htmlFor="item10" className="text-red-300 font-bold cursor-pointer flex items-center">
                    <span className="text-xl mr-2">👤👕</span> 影の戦士の残骸
                  </label>
                  <p className="text-white text-sm">黒Tシャツ10枚、同じデザインのスウェット5枚…そんなにいる！？</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white">選択したアイテム:</span>
              <span className={`font-bold ${atLeastFiveSelected ? "text-green-400" : "text-yellow-300"}`}>
                {discardItems.filter(Boolean).length} / 5 (最低目標)
              </span>
            </div>
            <div className="w-full bg-teal-950 rounded-full h-2.5 mt-2">
              <div
                className="bg-gradient-to-r from-red-500 to-yellow-500 h-2.5 rounded-full"
                style={{ width: `${(discardItems.filter(Boolean).length / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <Button
              onClick={saveRecord}
              disabled={isSaving || !atLeastFiveSelected}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                "保存中..."
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  断捨離完了！
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

