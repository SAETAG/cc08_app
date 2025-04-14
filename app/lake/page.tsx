"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, RefreshCw, Volume2, VolumeX, Home, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WaterRipple } from "@/components/water-ripple"

// 宝物アイテムの型定義
interface Treasure {
  id: string
  name: string
  description: string
  image: string
  source: "hanger" | "drawer" | "shelf"
  acquiredDate: string
  author: {
    name: string
    icon: string
  }
}

// サンプルデータ
const treasures: Treasure[] = [
  {
    id: "1",
    name: "毎朝ラクするゾーン分け収納",
    description: "ハンガーラック内を「使用頻度」でゾーニングしましょう。中心に最もよく使うトップスやジャケット、右側には週1～2回着るセミフォーマル、左側には季節外アイテムなどを分類して掛けるのがポイントです。朝の身支度が劇的に時短になり、迷う時間も削減！服の見逃しも防げます。カラー順に並べれば見た目も美しくなり、選ぶ楽しみも倍増します。",
    image: "/moc/tip/hanger1.png",
    source: "hanger",
    acquiredDate: "2025-03-15",
    author: {
      name: "Tsunodashi",
      icon: "/moc/user/tsunodashi.webp"
    }
  },
  {
    id: "2",
    name: "ハンガーは統一が正義",
    description: "異なる種類のハンガーを使っていると、服が傾いたり間隔が無駄に空いてしまって収納効率が悪化します。木製でもプラスチックでも構いませんが、「厚み」と「形」を揃えるだけで収納力は格段にアップ。滑り止め付きのハンガーならキャミソールやニットも安定して掛けられます。また、「1 in 1 out」ルールを設けて、1着増やしたら1着処分、を習慣化するとハンガー数と衣類数を常に最適に保てます。",
    image: "/moc/tip/hanger2.png",
    source: "hanger",
    acquiredDate: "2025-03-14",
    author: {
      name: "manta",
      icon: "/moc/user/manta.webp"
    }
  },
  {
    id: "3",
    name: "バッグの掛け場所を作る",
    description: "洋服を掛けるハンガーラックのサイドやフック部分に、バッグの定位置を作ると、出かける準備が一気にスムーズになります。S字フックや専用ベルトを活用すれば、型崩れしないように持ち手を整えて掛けられます。使用頻度の高いバッグ3〜4個を厳選し、その他は別保管に。視認性と管理性のバランスが重要です。",
    image: "/moc/tip/hanger3.jpg",
    source: "hanger",
    acquiredDate: "2025-03-13",
    author: {
      name: "nijihagi",
      icon: "/moc/user/nijihagi.webp"
    }
  },
  {
    id: "4",
    name: "ズボンは重ねない吊るし収納が快適",
    description: "ズボン・スラックス・ジーンズは畳んで積むより、専用のパンツハンガーに1本ずつ掛けると型崩れも防げ、何があるか一目瞭然に。クロスバー付きハンガーや段違いハンガーなら、省スペースで見やすさも確保できます。特に仕事用・普段着・季節ものを分けて収納すると、出番の偏りも防げます。",
    image: "/moc/tip/hanger4.jpg",
    source: "hanger",
    acquiredDate: "2025-03-12",
    author: {
      name: "tatejimakinchakudai",
      icon: "/moc/user/tatekin.webp"
    }
  },
  {
    id: "5",
    name: "季節オフはボックス＋ラベル管理",
    description: "クローゼットの上棚は手が届きにくいため、「季節外れ」のアイテムや「ストック品」を入れるのがベストです。中が見えないボックスを使う場合は、中身を記載したラベルがマスト。例えば「冬ニット（2025春まで）」など期間付きで記すと、見直しタイミングも分かりやすく、入れっぱなしを防げます。",
    image: "/moc/tip/shelf1.jpg",
    source: "shelf",
    acquiredDate: "2025-03-10",
    author: {
      name: "gomamongara",
      icon: "/moc/user/goma.webp"
    }
  },
  {
    id: "6",
    name: "冠婚葬祭・旅行グッズは使用シーン別に一括収納",
    description: "使用頻度が低いけれど重要なもの、たとえば冠婚葬祭用バッグ、礼服、サブバッグ、旅行ポーチなどは、シーン別にまとめて上棚へ。一つのボックスに「フォーマル一式」などと名前をつけておけば、急に必要になった時も慌てず取り出せます。バッグの中にメモやタイツ、アクセサリーを入れておくとさらに便利です。",
    image: "/moc/tip/shelf2.jpg",
    source: "shelf",
    acquiredDate: "2025-03-08",
    author: {
      name: "yagara",
      icon: "/moc/user/yagara.webp"
    }
  },
  {
    id: "7",
    name: "Tシャツは立てて＋分類で一発管理",
    description: "Tシャツや薄手トップスは立てる収納が基本。さらに「無地・プリント・仕事用」などで分類すると、取り出す時間が減るだけでなく、洗濯後に戻すのも楽になります。引き出し内でのズレを防ぐため、100均などで仕切りをつけて、隙間なく収まるよう調整しましょう。見た目もスッキリ、時短効果も抜群です。",
    image: "/moc/tip/drawer1.jpeg",
    source: "drawer",
    acquiredDate: "2025-03-05",
    author: {
      name: "kaeruankou",
      icon: "/moc/user/kaeru.webp"
    }
  },
  {
    id: "8",
    name: "厚手衣類は重ね3枚までルールで快適",
    description: "厚手のニットやトレーナーなどは、重ねすぎると下が見えなくなり、着なくなる服を生みがち。引き出し内にしまう場合は「1仕切りにつき3枚まで」と決めて、圧縮しすぎない工夫を。使用頻度が低いアイテムは、圧縮袋やオフシーズンボックスへ移して、毎日の動線に余白を作ることも重要です。",
    image: "/moc/tip/drawer2.webp",
    source: "drawer",
    acquiredDate: "2025-03-01",
    author: {
      name: "minamihakofugu",
      icon: "/moc/user/minami.webp"
    }
  },
]

export default function LakePage() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filteredTreasures, setFilteredTreasures] = useState<Treasure[]>(treasures)
  const [currentFilter, setCurrentFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio on client side
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/lake.mp3") // 後で lake.mp3 に変更

    if (audioRef.current) {
      // Set audio properties
      audioRef.current.loop = true
      audioRef.current.volume = 0.4

      // Play audio if sound is enabled
      if (soundEnabled) {
        audioRef.current.play().catch((error) => {
          console.log("Audio autoplay failed:", error)
          // Many browsers require user interaction before playing audio
        })
      }
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle sound toggle
  useEffect(() => {
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.play().catch((error) => {
          console.log("Audio play failed:", error)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [soundEnabled])

  // Toggle sound function
  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
  }

  // Filter treasures based on tab selection
  useEffect(() => {
    if (currentFilter === "all") {
      setFilteredTreasures(treasures)
    } else if (currentFilter === "hanger") {
      setFilteredTreasures(treasures.filter((treasure) => treasure.source === "hanger"))
    } else if (currentFilter === "drawer") {
      setFilteredTreasures(treasures.filter((treasure) => treasure.source === "drawer"))
    } else if (currentFilter === "shelf") {
      setFilteredTreasures(treasures.filter((treasure) => treasure.source === "shelf"))
    }
  }, [currentFilter])

  // Handle treasure click
  const handleTreasureClick = (treasure: Treasure) => {
    setSelectedTreasure(treasure)
    setIsDialogOpen(true)
  }

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      // Here you would typically fetch new data from an API
      setIsRefreshing(false)
    }, 1500)
  }

  // Get icon component based on treasure icon type
  const getTreasureIcon = (imagePath: string) => {
    return (
      <div className="w-full h-full rounded-lg bg-cyan-500/30 flex items-center justify-center overflow-hidden">
        <img 
          src={imagePath} 
          alt="収納チップス" 
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[url('/lake.png')] bg-cover bg-center relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-blue-800/60 z-0"></div>

      {/* Water ripple effect background */}
      <WaterRipple />

      {/* Mystical light effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-cyan-400/10 blur-xl"></div>
        <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full bg-indigo-400/10 blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 rounded-full bg-purple-400/10 blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-400/10 blur-xl"></div>
      </div>

      {/* Fog effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent z-0"></div>

      {/* Top navigation bar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-2 flex items-center justify-between">
        <Link href="/home">
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 rounded-full bg-blue-900/60 text-cyan-300 hover:text-cyan-200 hover:bg-blue-800/70 border border-cyan-500/30"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">戻る</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className={`w-10 h-10 rounded-full bg-blue-900/60 text-cyan-300 hover:text-cyan-200 hover:bg-blue-800/70 border border-cyan-500/30 ${isRefreshing ? "animate-spin" : ""}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className="w-5 h-5" />
            <span className="sr-only">更新</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 rounded-full bg-blue-900/60 text-cyan-300 hover:text-cyan-200 hover:bg-blue-800/70 border border-cyan-500/30"
            onClick={toggleSound}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="sr-only">{soundEnabled ? "サウンド オン" : "サウンド オフ"}</span>
          </Button>

          <Link href="/home">
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full bg-blue-900/60 text-cyan-300 hover:text-cyan-200 hover:bg-blue-800/70 border border-cyan-500/30"
            >
              <Home className="w-5 h-5" />
              <span className="sr-only">ホーム</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-16">
        {/* Header with title */}
        <div className="w-full mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300 drop-shadow-[0_2px_8px_rgba(0,255,255,0.5)]">
            収納の湖
          </h1>
          <p className="text-cyan-200/80 max-w-2xl mx-auto">
            「収納」に困ったら、他の勇者たちの知恵のしずくを眺めてみよう。
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentFilter}>
            <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto bg-blue-900/50 border border-cyan-500/30">
              <TabsTrigger value="all" className="data-[state=active]:bg-cyan-800/50">
                すべての収納
              </TabsTrigger>
              <TabsTrigger value="hanger" className="data-[state=active]:bg-cyan-800/50">
                ハンガーラック
              </TabsTrigger>
              <TabsTrigger value="drawer" className="data-[state=active]:bg-cyan-800/50">
                引き出し
              </TabsTrigger>
              <TabsTrigger value="shelf" className="data-[state=active]:bg-cyan-800/50">
                棚
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Treasures grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {filteredTreasures.map((treasure) => (
            <div
              key={treasure.id}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => handleTreasureClick(treasure)}
            >
              {/* Treasure image */}
              <div className="absolute inset-0">
                <img 
                  src={treasure.image} 
                  alt={treasure.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay with title */}
              <div className={`absolute bottom-0 left-0 right-0 p-2 backdrop-blur-sm ${
                treasure.source === "hanger" 
                  ? "bg-indigo-900/80" 
                  : treasure.source === "drawer"
                    ? "bg-teal-900/80"
                    : "bg-pink-900/80"
              }`}>
                <h3 className="text-center text-sm font-medium text-amber-300 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{treasure.name}</h3>
              </div>

              {/* Source badge */}
              <div className="absolute top-2 right-2">
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    treasure.source === "hanger" 
                      ? "bg-indigo-800/70 text-indigo-200" 
                      : treasure.source === "drawer"
                        ? "bg-teal-800/70 text-teal-200"
                        : "bg-pink-800/70 text-pink-200"
                  }`}
                >
                  {treasure.source === "hanger" 
                    ? "ハンガーラック" 
                    : treasure.source === "drawer"
                      ? "引き出し"
                      : "棚"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredTreasures.length === 0 && (
          <div className="text-center py-12">
            <div className="text-cyan-300 mb-4">
              <Info className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl text-cyan-200 mb-2">秘宝が見つかりません</h3>
            <p className="text-cyan-300/70">
              この種類の秘宝はまだ獲得していないようです。クエストやデイリーミッションに挑戦して秘宝を集めましょう。
            </p>
          </div>
        )}
      </div>

      {/* Treasure detail dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`${selectedTreasure?.source === "hanger" 
          ? "bg-indigo-950/95 border-indigo-500/50" 
          : selectedTreasure?.source === "drawer"
            ? "bg-teal-950/95 border-teal-500/50"
            : "bg-pink-950/95 border-pink-500/50"
        } text-cyan-50 max-w-4xl`}>
          {selectedTreasure && (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">{selectedTreasure.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                {/* Left side - Image */}
                <div className="relative aspect-square">
                  <img 
                    src={selectedTreasure.image} 
                    alt={selectedTreasure.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Right side - Content */}
                <div className="flex flex-col">
                  {/* Title and date */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-amber-300 mb-2">{selectedTreasure.name}</h2>
                    <p className="text-sm text-amber-300/70">
                      投稿日: {new Date(selectedTreasure.acquiredDate).toLocaleDateString("ja-JP")}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-amber-100">{selectedTreasure.description}</p>
                  </div>

                  {/* Tag */}
                  <div className="mb-6">
                    <div
                      className={`inline-block text-sm px-3 py-1 rounded-full ${
                        selectedTreasure.source === "hanger" 
                          ? "bg-indigo-800/70 text-indigo-200" 
                          : selectedTreasure.source === "drawer"
                            ? "bg-teal-800/70 text-teal-200"
                            : "bg-pink-800/70 text-pink-200"
                      }`}
                    >
                      {selectedTreasure.source === "hanger" 
                        ? "ハンガーラック" 
                        : selectedTreasure.source === "drawer"
                          ? "引き出し"
                          : "棚"}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={selectedTreasure.author.icon} 
                          alt={selectedTreasure.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-amber-100">{selectedTreasure.author.name}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4 mt-auto">
                    <Button className={`flex-1 ${
                      selectedTreasure.source === "hanger" 
                        ? "bg-indigo-700 hover:bg-indigo-600" 
                        : selectedTreasure.source === "drawer"
                          ? "bg-teal-700 hover:bg-teal-600"
                          : "bg-pink-700 hover:bg-pink-600"
                    } text-white`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                      共有する
                    </Button>
                    <Button className={`flex-1 ${
                      selectedTreasure.source === "hanger" 
                        ? "bg-indigo-700 hover:bg-indigo-600" 
                        : selectedTreasure.source === "drawer"
                          ? "bg-teal-700 hover:bg-teal-600"
                          : "bg-pink-700 hover:bg-pink-600"
                    } text-white`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                      保存する
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}



