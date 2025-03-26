"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Volume2, VolumeX, ArrowLeft, Home, MapPin } from "lucide-react"

export default function Stage10BattlePage() {
  // 状態の変更
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [storageChecked, setStorageChecked] = useState({
    hanger: Array(5).fill(false),
    shelf: Array(5).fill(false),
    drawer: Array(4).fill(false),
    box: Array(4).fill(false),
    compress: Array(3).fill(false),
    hook: Array(3).fill(false),
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/stepfight_10.mp3")
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

  // Toggle storage checked
  const toggleStorage = (type: keyof typeof storageChecked, index: number) => {
    const newStorageChecked = { ...storageChecked }
    newStorageChecked[type][index] = !newStorageChecked[type][index]
    setStorageChecked(newStorageChecked)

    // チェックボックス操作時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Count total checked items
  const totalChecked = Object.values(storageChecked).flat().filter(Boolean).length

  // Check if at least 5 items are checked
  const atLeastFiveChecked = totalChecked >= 5

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
          stageId: 10
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save record');
      }

      // Navigate to clear page
      router.push("/closet/10/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
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

        <div className="flex items-center gap-2">
          <Link href="/closet/10">
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
              収納の回廊 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">収納場所を決める</h2>

          <p className="text-white mb-6 text-center">
            今、「賢者の箱」はアイテムや使用頻度毎にグルーピングされているはずじゃ。
            <br />
            さぁ、一つ一つをクローゼットに収納していこう。
             <br />
            以下のコツをチェックしながら、「お気に入り」達をしまっていこう！
          </p>

          {/* Storage tips tabs */}
          <Tabs defaultValue="hanger" className="mb-8">
            <div className="mb-8">
              <TabsList className="flex flex-wrap bg-teal-800 w-full">
                <TabsTrigger
                  value="hanger"
                  className="flex-1 basis-1/3 text-xs sm:text-sm py-1.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white bg-teal-700 text-teal-100"
                >
                  ハンガー
                </TabsTrigger>
                <TabsTrigger
                  value="shelf"
                  className="flex-1 basis-1/3 text-xs sm:text-sm py-1.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white bg-teal-700 text-teal-100"
                >
                  棚
                </TabsTrigger>
                <TabsTrigger
                  value="drawer"
                  className="flex-1 basis-1/3 text-xs sm:text-sm py-1.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white bg-teal-700 text-teal-100"
                >
                  引き出し
                </TabsTrigger>
                <TabsTrigger
                  value="box"
                  className="flex-1 basis-1/3 text-xs sm:text-sm py-1.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white bg-teal-700 text-teal-100"
                >
                  ボックス
                </TabsTrigger>
                <TabsTrigger
                  value="compress"
                  className="flex-1 basis-1/3 text-xs sm:text-sm py-1.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white bg-teal-700 text-teal-100"
                >
                  圧縮袋
                </TabsTrigger>
                <TabsTrigger
                  value="hook"
                  className="flex-1 basis-1/3 text-xs sm:text-sm py-1.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white bg-teal-700 text-teal-100"
                >
                  フック
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Hanger tips */}
            <TabsContent
              value="hanger"
              className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 mt-0"
            >
              <h3 className="text-lg font-bold text-yellow-300 mb-4">🧥 ハンガー収納のコツ</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="hanger1"
                    checked={storageChecked.hanger[0]}
                    onCheckedChange={() => toggleStorage("hanger", 0)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="hanger1" className="text-blue-300 font-bold cursor-pointer">
                      ✅ ハンガーを統一すると見た目スッキリ！
                    </label>
                    <p className="text-white text-sm">
                      ➡ プラスチック・木製・マワハンガーなど、種類を揃えるだけで整った印象に✨
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="hanger2"
                    checked={storageChecked.hanger[1]}
                    onCheckedChange={() => toggleStorage("hanger", 1)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="hanger2" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 服の種類別に並べると迷わない！
                    </label>
                    <p className="text-white text-sm">
                      ➡ シャツ・ジャケット・ワンピースなどカテゴリーごとに並べると、一目で選びやすい！
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="hanger3"
                    checked={storageChecked.hanger[2]}
                    onCheckedChange={() => toggleStorage("hanger", 2)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="hanger3" className="text-blue-300 font-bold cursor-pointer">
                      ✅ スペースを有効活用する「省スペースハンガー」
                    </label>
                    <p className="text-white text-sm">
                      ➡ 連結できるハンガーや、マルチハンガーで縦に収納すると省スペース👌
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="hanger4"
                    checked={storageChecked.hanger[3]}
                    onCheckedChange={() => toggleStorage("hanger", 3)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="hanger4" className="text-blue-300 font-bold cursor-pointer">
                      ✅ クリップハンガーを使ってボトムスをすっきり収納！
                    </label>
                    <p className="text-white text-sm">➡ ズボン・スカートは縦掛けするとシワになりにくい💡</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="hanger5"
                    checked={storageChecked.hanger[4]}
                    onCheckedChange={() => toggleStorage("hanger", 4)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="hanger5" className="text-blue-300 font-bold cursor-pointer">
                      ✅ ハンガーに滑り止め加工を！
                    </label>
                    <p className="text-white text-sm">➡ ずり落ち防止にマワハンガーや、DIYで輪ゴムを巻くのもアリ🙆‍♀️</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Shelf tips */}
            <TabsContent value="shelf" className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 mt-0">
              <h3 className="text-lg font-bold text-yellow-300 mb-4">
                📚 棚収納のコツ（オープンラック・クローゼット棚）
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="shelf1"
                    checked={storageChecked.shelf[0]}
                    onCheckedChange={() => toggleStorage("shelf", 0)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="shelf1" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 頻度別に分ける（目線＆手が届く場所にデイリー服）
                    </label>
                    <p className="text-white text-sm">
                      ➡ よく使う服は「目線の高さ」、季節ものは「上段」、小物は「下段」に
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="shelf2"
                    checked={storageChecked.shelf[1]}
                    onCheckedChange={() => toggleStorage("shelf", 1)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="shelf2" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 畳んで立てる収納で「見える化」
                    </label>
                    <p className="text-white text-sm">
                      ➡ 引き出し式のケースにTシャツやニットを縦収納すると、一目で見やすい！
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="shelf3"
                    checked={storageChecked.shelf[2]}
                    onCheckedChange={() => toggleStorage("shelf", 2)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="shelf3" className="text-blue-300 font-bold cursor-pointer">
                      ✅ ボックスやカゴで「グループ収納」
                    </label>
                    <p className="text-white text-sm">
                      ➡ 「下着」「部屋着」「オフシーズン服」など、ボックスごとに分けると取り出しやすい！
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="shelf4"
                    checked={storageChecked.shelf[3]}
                    onCheckedChange={() => toggleStorage("shelf", 3)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="shelf4" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 棚板を増やしてデッドスペース活用
                    </label>
                    <p className="text-white text-sm">➡ 可動式の棚や追加ラックを使うと、空間を無駄なく使える🛠</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="shelf5"
                    checked={storageChecked.shelf[4]}
                    onCheckedChange={() => toggleStorage("shelf", 4)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="shelf5" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 詰め込みすぎない！
                    </label>
                    <p className="text-white text-sm">➡ ぎゅうぎゅうに詰めると取り出しにくいので、7〜8割収納をキープ</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Drawer tips */}
            <TabsContent
              value="drawer"
              className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 mt-0"
            >
              <h3 className="text-lg font-bold text-yellow-300 mb-4">🗄 引き出し収納のコツ</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="drawer1"
                    checked={storageChecked.drawer[0]}
                    onCheckedChange={() => toggleStorage("drawer", 0)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="drawer1" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 「立てる収納」で一目瞭然！
                    </label>
                    <p className="text-white text-sm">➡ 服を「ファイル状」にすると、取り出すときに崩れにくい💡</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="drawer2"
                    checked={storageChecked.drawer[1]}
                    onCheckedChange={() => toggleStorage("drawer", 1)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="drawer2" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 仕切りケースを使うとカオスにならない！
                    </label>
                    <p className="text-white text-sm">
                      ➡ 100均の仕切りボックスやファイルケースでエリアを作るとスッキリ✨
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="drawer3"
                    checked={storageChecked.drawer[2]}
                    onCheckedChange={() => toggleStorage("drawer", 2)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="drawer3" className="text-blue-300 font-bold cursor-pointer">
                      ✅ ラベリングすると迷わない！
                    </label>
                    <p className="text-white text-sm">
                      ➡ 「靴下」「インナー」「Tシャツ」など、ラベルをつけると家族も片付けしやすい👨‍👩‍👧‍👦
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="drawer4"
                    checked={storageChecked.drawer[3]}
                    onCheckedChange={() => toggleStorage("drawer", 3)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="drawer4" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 奥行きを有効活用するために「使用頻度順」
                    </label>
                    <p className="text-white text-sm">➡ よく使うものは手前、あまり使わないものは奥へ</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Box tips */}
            <TabsContent value="box" className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 mt-0">
              <h3 className="text-lg font-bold text-yellow-300 mb-4">🛍 収納ボックス＆ケースのコツ</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="box1"
                    checked={storageChecked.box[0]}
                    onCheckedChange={() => toggleStorage("box", 0)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="box1" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 透明 or 半透明のケースで中身を把握！
                    </label>
                    <p className="text-white text-sm">➡ 何が入っているかわかると、探し物が減る👀</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="box2"
                    checked={storageChecked.box[1]}
                    onCheckedChange={() => toggleStorage("box", 1)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="box2" className="text-blue-300 font-bold cursor-pointer">
                      ✅ オフシーズンの服は「ラベル付きボックス」に
                    </label>
                    <p className="text-white text-sm">➡ 季節ごとに衣替えがラクになる🌸❄</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="box3"
                    checked={storageChecked.box[2]}
                    onCheckedChange={() => toggleStorage("box", 2)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="box3" className="text-blue-300 font-bold cursor-pointer">
                      ✅ ボックスは「用途別」に分類！
                    </label>
                    <p className="text-white text-sm">➡ 例：「普段着」「スポーツウェア」「冠婚葬祭」</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="box4"
                    checked={storageChecked.box[3]}
                    onCheckedChange={() => toggleStorage("box", 3)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="box4" className="text-blue-300 font-bold cursor-pointer">
                      ✅ クローゼットの上段収納は「取っ手付きケース」が便利！
                    </label>
                    <p className="text-white text-sm">➡ 取り出しやすくなるので、出し入れストレスなし✨</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Compression bag tips */}
            <TabsContent
              value="compress"
              className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 mt-0"
            >
              <h3 className="text-lg font-bold text-yellow-300 mb-4">🎭 圧縮袋のコツ（オフシーズン服収納向け）</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="compress1"
                    checked={storageChecked.compress[0]}
                    onCheckedChange={() => toggleStorage("compress", 0)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="compress1" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 厚手の服は圧縮して省スペース！
                    </label>
                    <p className="text-white text-sm">➡ ダウンジャケット・ニット・毛布などをコンパクトに👕</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="compress2"
                    checked={storageChecked.compress[1]}
                    onCheckedChange={() => toggleStorage("compress", 1)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="compress2" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 圧縮袋は「空気を抜きすぎない」のがポイント！
                    </label>
                    <p className="text-white text-sm">➡ 過度に圧縮するとシワになるので、7〜8割の空気を抜くのがベスト</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="compress3"
                    checked={storageChecked.compress[2]}
                    onCheckedChange={() => toggleStorage("compress", 2)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="compress3" className="text-blue-300 font-bold cursor-pointer">
                      ✅ 立てて収納すると出し入れしやすい！
                    </label>
                    <p className="text-white text-sm">➡ クローゼットや押入れに、ブックスタンドのように収納📚</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Hook tips */}
            <TabsContent value="hook" className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 mt-0">
              <h3 className="text-lg font-bold text-yellow-300 mb-4">🪝 フック＆S字フックの活用</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="hook1"
                    checked={storageChecked.hook[0]}
                    onCheckedChange={() => toggleStorage("hook", 0)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="hook1" className="text-blue-300 font-bold cursor-pointer">
                      ✅ バッグや帽子は「吊るす収納」で型崩れ防止！
                    </label>
                    <p className="text-white text-sm">➡ 壁やクローゼット内にフックを取り付けて収納👜👒</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="hook2"
                    checked={storageChecked.hook[1]}
                    onCheckedChange={() => toggleStorage("hook", 1)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="hook2" className="text-blue-300 font-bold cursor-pointer">
                      ✅ デッドスペースを有効活用
                    </label>
                    <p className="text-white text-sm">➡ クローゼットのポールやドア裏にS字フックでアイテムを吊るす</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="hook3"
                    checked={storageChecked.hook[2]}
                    onCheckedChange={() => toggleStorage("hook", 2)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                  />
                  <div>
                    <label htmlFor="hook3" className="text-blue-300 font-bold cursor-pointer">
                      ✅ ハンガーと一緒に使うと収納力UP！
                    </label>
                    <p className="text-white text-sm">➡ ベルト・スカーフ・ストールも一緒にまとめられる✨</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Progress indicator */}
          <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white">チェックしたコツ:</span>
              <span className={`font-bold ${atLeastFiveChecked ? "text-green-400" : "text-yellow-300"}`}>
                {totalChecked} / 5 (最低目標)
              </span>
            </div>
            <div className="w-full bg-teal-950 rounded-full h-2.5 mt-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-green-500 h-2.5 rounded-full"
                style={{ width: `${(totalChecked / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={saveRecord}
              disabled={isSaving || !atLeastFiveChecked}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                "保存中..."
              ) : (
                <>
                  <MapPin className="h-5 w-5" />
                  収納完了！
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

