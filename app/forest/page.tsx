"use client"

import { useState, useEffect } from "react"
import { FallingLeaves } from "@/components/falling-leaves"
import Image from "next/image"
import { Heart, Filter, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostModal } from "@/components/post-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createPortal } from "react-dom"
import Link from "next/link"

// Mock data for posts
const discardPosts = [
  {
    id: 1,
    image: "/moc/forest/1.jpg",
    name: "おばあちゃんの手編みセーター",
    description: "おばあちゃんが編んでくれた手編みのセーター。少しチクチクするけど、愛情が詰まってて冬はいつもこれを着てた。サイズが合わなくなっちゃったけど、温かい思い出はそのまま。ありがとう、おばあちゃん。",
    itemType: "セーター",
    usedYears: "5年",
    user: { name: "Tsunodashi", avatar: "/moc/user/tsunodashi.webp" },
    likes: 24,
    date: "2日前",
  },
  {
    id: 2,
    image: "/moc/forest/2.jpg",
    name: "初めてのデート服",
    description: "高校生の時、勇気を出して買ったワンピース。初めてのデートで着て、ドキドキしたのを覚えてる。少し色褪せちゃったけど、甘酸っぱい思い出がいっぱい。ありがとう、あの日の私。",
    itemType: "ワンピース",
    usedYears: "7年",
    user: { name: "Manta", avatar: "/moc/user/manta.webp" },
    likes: 18,
    date: "1週間前",
  },
  {
    id: 3,
    image: "/moc/forest/3.jpg",
    name: "鋼の相棒",
    description: "新卒で入社し、右も左も分からなかったあの頃、いつもこの腕時計と一緒だった。7年、お疲れさま。",
    itemType: "腕時計",
    usedYears: "7年",
    user: { name: "Nijihagi", avatar: "/moc/user/nijihagi.webp" },
    likes: 32,
    date: "3日前",
  },
  {
    id: 4,
    image: "/moc/forest/4.jpg",
    name: "穴あきロック魂ジーンズ",
    description: "ライブハウスで暴れすぎて膝に穴が開いたジーンズ。何度も洗濯して色落ちしたけど、それが味になってる。これを履くと無敵な気分になれた。ありがとう、相棒。次のロッカーへ。",
    itemType: "ジーンズ",
    usedYears: "15年",
    user: { name: "Tatekin", avatar: "/moc/user/tatekin.webp" },
    likes: 45,
    date: "1日前",
  },
  {
    id: 5,
    image: "/moc/forest/5.jpg",
    name: "夢見るモコモコパジャマ",
    description: "寒い冬の夜、このモコモコパジャマに何度救われたことか。暖かくて、着るだけで幸せな気分になれた。少し毛玉が目立ってきたけど、たくさんの良い夢を見せてくれてありがとう。",
    itemType: "パジャマ",
    usedYears: "3年",
    user: { name: "Goma", avatar: "/moc/user/goma.webp" },
    likes: 29,
    date: "2週間前",
  },
  {
    id: 6,
    image: "/moc/forest/6.jpg",
    name: "就活無双コート",
    description: "初めてのボーナスで買った、ちょっと背伸びしたコート。これを着て臨んだ面接はなぜか上手くいった気がする。社会人の第一歩を支えてくれた相棒。少し形が古くなったかな。ありがとう。",
    itemType: "コート",
    usedYears: "8年",
    user: { name: "Yagara", avatar: "/moc/user/yagara.webp" },
    likes: 21,
    date: "5日前",
  },
  {
    id: 7,
    image: "/moc/forest/7.jpg",
    name: "旅紋の背袋",
    description: "このリュックと一緒に、日本中を旅した。富士山も、屋久島も、知らない町のゲストハウスも、全部の匂いが染みついてる。サイドポケットに入ってた謎のガムは、たぶん2015年産。それも含めて、最高の思い出。ありがとう、相棒。新たな旅人の背中で、また世界を見ておいで。",
    itemType: "リュックサック",
    usedYears: "12年",
    user: { name: "Kaeru", avatar: "/moc/user/kaeru.webp" },
    likes: 38,
    date: "4日前",
  },
  {
    id: 8,
    image: "/moc/forest/8.jpg",
    name: "風になびいた思い出スカート",
    description: "お気に入りでよく履いていた花柄のスカート。これを履いて出かけると、いつも良いことがあった気がする。裾が少しほつれてしまったけど、たくさんの素敵な場所に連れて行ってくれてありがとう。",
    itemType: "スカート",
    usedYears: "6年",
    user: { name: "Minami", avatar: "/moc/user/minami.webp" },
    likes: 33,
    date: "1日前",
  },
  {
    id: 9,
    image: "/moc/forest/9.jpg",
    name: "一張羅のレザージャケット",
    description: "一目惚れして買ったレザージャケット。これを羽織るだけで、ちょっと強くなれた気がした。擦り傷も、雨のシミも、全部が自分だけの歴史。だいぶ身体に馴染んだけど、次の世代に託します。ありがとう。",
    itemType: "ジャケット",
    usedYears: "20年",
    user: { name: "Tsunodashi", avatar: "/moc/user/tsunodashi.webp" },
    likes: 51,
    date: "今日",
  },
  {
    id: 10,
    image: "/moc/forest/10.jpg",
    name: "部屋着のエースパーカー",
    description: "気づけばいつも着ていた、くたくたのパーカー。リラックスタイムの必需品だった。袖口が擦り切れて、フードの紐もなくなったけど、最高の着心地をありがとう。お疲れ様。",
    itemType: "パーカー",
    usedYears: "10年",
    user: { name: "Nijihagi", avatar: "/moc/user/nijihagi.webp" },
    likes: 12,
    date: "1時間前",
  },
  {
    id: 11,
    image: "/moc/forest/11.jpg",
    name: "青春のバンT",
    description: "高校時代のライブで買った思い出のバンドTシャツ。汗と涙と、たぶんケチャップのシミ付き。首元ヨレヨレ、穴も空いてるけど、これが青春の証。ありがとう、ロックンロール。次のロッカーに魂を受け継ぐぜ。",
    itemType: "Tシャツ",
    usedYears: "10年",
    user: { name: "Tatekin", avatar: "/moc/user/tatekin.webp" },
    likes: 25,
    date: "6時間前",
  },
  {
    id: 12,
    image: "/moc/forest/12.jpg",
    name: "戦いのガラス靴",
    description: "就職活動で履き潰した、勝負パンプス。足は痛かったけど、これを履くと背筋が伸びた。何度も面接に落ちて泣いた夜も、内定をもらって飛び跳ねた日も一緒だったね。ありがとう。次のシンデレラへ。",
    itemType: "パンプス",
    usedYears: "4年",
    user: { name: "Goma", avatar: "/moc/user/goma.webp" },
    likes: 19,
    date: "昨日",
  },
  {
    id: 13,
    image: "/moc/forest/13.jpg",
    name: "手編みの温もり",
    description: "元カノが編んでくれたマフラー。正直、色合いは微妙だったけど、めちゃくちゃ暖かかった。寒い冬の帰り道、君のおかげで凍えずに済んだよ。ありがとう、不器用な優しさ。誰か、この温もりを引き継いでくれ。",
    itemType: "マフラー",
    usedYears: "5年",
    user: { name: "Nijihagi", avatar: "/moc/user/nijihagi.webp" },
    likes: 30,
    date: "3日前",
  },
  {
    id: 14,
    image: "/moc/forest/14.jpg",
    name: "被らなかった旅人の帽子",
    description: "「いつかこれで旅に出るんだ」と意気込んで買った帽子。結局、一度も被らずクローゼットの奥で眠っていた。似合わなかったのか、勇気がなかったのか。ありがとう、叶わなかった夢の象徴。君に似合う、本当の旅人が現れますように。",
    itemType: "帽子",
    usedYears: "7年",
    user: { name: "Kaeru", avatar: "/moc/user/kaeru.webp" },
    likes: 15,
    date: "1週間前",
  },
  {
    id: 15,
    image: "/moc/forest/15.jpg",
    name: "体型変化のバックル",
    description: "学生時代から使っている革のベルト。穴の位置が少しずつ外側に移動していったのは、成長の証……ということにしておこう。バックルも傷だらけ。長い間、ズボンがずり落ちないように支えてくれてありがとう。お疲れ様。",
    itemType: "ベルト",
    usedYears: "13年",
    user: { name: "Tsunodashi", avatar: "/moc/user/tsunodashi.webp" },
    likes: 22,
    date: "今日",
  },
]

export function PostList() {
  const [sortBy, setSortBy] = useState("newest")
  const [selectedPost, setSelectedPost] = useState<(typeof discardPosts)[0] | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showUploadCard, setShowUploadCard] = useState(false)

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (selectedPost || isCreateModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [selectedPost, isCreateModalOpen])

  // Sort posts based on selected criteria
  const sortedPosts = [...discardPosts].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.likes ?? 0) - (a.likes ?? 0)
    }
    return b.id - a.id
  })

  const handleSort = (type: string) => {
    setSortBy(type)
  }

  const handlePostClick = (post: (typeof discardPosts)[0]) => {
    setSelectedPost(post)
  }

  const closeModal = () => {
    setSelectedPost(null)
  }

  const handleCreatePost = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
    setShowUploadCard(false)
  }

  const handleUploadClick = () => {
    setShowUploadCard(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-green-900/50 border-amber-200/30 text-amber-100">
              <Filter className="w-4 h-4 mr-2" />
              {sortBy === "newest" ? "新着順" : "人気順"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-green-900 border-amber-200/30">
            <DropdownMenuItem onClick={() => handleSort("newest")} className="text-amber-100 hover:bg-green-800">
              新着順
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("popular")} className="text-amber-100 hover:bg-green-800">
              人気順
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid layout for the cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="w-[240px] h-[240px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] transform transition-all duration-300 hover:scale-[1.05] hover:z-10 cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <div
              className="w-full h-full rounded-full overflow-hidden border-4 border-amber-200/40 shadow-lg relative group"
              style={{
                boxShadow: `
                  0 0 15px 5px rgba(251, 191, 36, 0.2),
                  0 0 30px 10px rgba(251, 191, 36, 0.1),
                  0 0 45px 15px rgba(251, 191, 36, 0.05)
                `,
              }}
            >
              {/* Pulsing glow effect */}
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0) 70%)",
                  animationDuration: `${3 + (post.id % 3)}s`,
                }}
              ></div>

              {/* Image container */}
              <div className="absolute inset-0 z-0">
                <div className="relative w-full h-full">
                  <Image src={post.image || "/placeholder.svg"} alt={post.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent" />
                </div>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                {/* Top section - now empty */}
                <div className="flex-grow"></div>

                {/* Bottom section with item name and interactions */}
                <div className="space-y-3">
                  <h3 className="text-base md:text-lg text-amber-200 text-center bg-green-900/60 px-3 py-1.5 rounded-full truncate">
                    {post.name}
                  </h3>

                  <div className="flex justify-center">
                    <button className="flex items-center text-amber-100/80 hover:text-amber-200 bg-green-900/60 rounded-full px-3 py-1.5">
                      <Heart className="w-4 h-4 md:w-5 md:h-5 mr-1.5" />
                      <span className="text-sm md:text-base">{post.likes}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hover overlay with only description */}
              <div className="absolute inset-0 bg-green-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 z-20">
                <div className="text-center">
                  <p className="text-sm md:text-base text-amber-100/90 italic leading-relaxed">"{post.description}"</p>
                </div>
              </div>

              {/* Sparkle effects */}
              <div
                className="absolute top-[15%] right-[20%] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-200 animate-ping"
                style={{ animationDuration: "3s" }}
              ></div>
              <div
                className="absolute top-[70%] left-[25%] w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-200 animate-ping"
                style={{ animationDuration: "2.5s" }}
              ></div>
              <div
                className="absolute top-[40%] left-[15%] w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-amber-200 animate-ping"
                style={{ animationDuration: "4s" }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal - Full Screen Overlay */}
      {selectedPost && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
          onClick={closeModal}
        >
          <div
            className="bg-green-900/90 border border-amber-200/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-amber-100/80 hover:text-amber-200 z-10"
              aria-label="閉じる"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column - Image */}
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden border-2 border-amber-200/30">
                  <Image
                    src={selectedPost.image || "/placeholder.svg"}
                    alt={selectedPost.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Right column - Details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl text-amber-200 mb-2 leading-tight">{selectedPost.name}</h2>
                    <p className="text-lg text-amber-100/90 mb-3">
                      <span className="font-medium">{selectedPost.itemType}</span>
                    </p>

                    {/* Used years */}
                    <div className="mb-3">
                      <div className="inline-flex items-center bg-green-800/60 rounded-full px-3 py-1 text-amber-100 text-sm">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>使用期間: {selectedPost.usedYears}</span>
                      </div>
                    </div>

                    <p className="text-amber-100/80 italic">"{selectedPost.description}"</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-amber-200/50">
                      <Image
                        src={selectedPost.user.avatar || "/placeholder.svg"}
                        alt={selectedPost.user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-amber-100">{selectedPost.user.name}</p>
                      <p className="text-xs text-amber-100/60">{selectedPost.date}</p>
                    </div>
                  </div>

                  {/* Enhanced Likes Section */}
                  <div className="bg-green-800/30 rounded-lg p-4 border border-amber-200/20">
                    <div className="flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6 text-amber-400 mr-2" />
                      <span className="text-lg font-medium text-amber-200">
                        {selectedPost.likes}
                        <span className="text-sm ml-1">人がいいね</span>
                      </span>
                    </div>

                    {/* Like button */}
                    <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center">
                      <Heart className="w-5 h-5 mr-2" />
                      いいねする
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Create Post Modal */}
      <PostModal 
        open={isCreateModalOpen} 
        onClose={handleCloseCreateModal}
      />
    </div>
  )
}

export default function ForestPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/forest.png"
          alt="Forest Background"
          fill
          className="object-cover"
          priority
        />
        {/* Teal Overlay */}
        <div className="absolute inset-0 bg-teal-900/30" />
      </div>

      {/* Falling Leaves */}
      <FallingLeaves />

      <div className="container mx-auto py-8 relative">
        <Link 
          href="/home" 
          className="absolute top-4 left-4 text-amber-200 hover:text-amber-100 transition-colors"
        >
          ← クローゼット王国に戻る
        </Link>

        <h1 className="text-6xl text-amber-200 text-center mb-12">
          断捨離の森
        </h1>
        <PostList />
      </div>
    </div>
  )
}
