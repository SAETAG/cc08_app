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
    name: "賢者の詠書",
    description: "大学生活の4年間、試験のたびに共に夜を越えた参考書たち。コーヒーの染み、落書き、付箋だらけのページ……まるで冒険の地図のようだった。君がいなければ、私は「経済学入門」に敗れていた。ありがとう、賢者の書よ。君の知恵は、次の冒険者へ受け継がれる。",
    itemType: "参考書",
    usedYears: "5年",
    user: { name: "Tsunodashi", avatar: "/moc/user/tsunodashi.webp" },
    likes: 24,
    date: "2日前",
  },
  {
    id: 2,
    image: "/moc/forest/2.jpg",
    name: "想いの封書",
    description: "この日記帳には、10代の怒り、恋、失敗、そして希望がぎゅっと詰まっている。中二病炸裂の詩も、初めての恋に泣いた夜も、全部ここにある。今読むと顔から火が出そう。でも、あの頃の自分がいたから、今の自分がいる。そっと封を閉じて、新しい誰かに託します。",
    itemType: "日記帳",
    usedYears: "10年",
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
    name: "音紡の竪琴",
    description: "弾き語りデビューは、このギターとともに。Fコードが押さえられなくて泣いた日、学園祭で告白ソングを披露した日、深夜の弾き語りで近所に怒られた日……全部、いい思い出。次の奏者よ、どうかこの音を受け継いでくれ。たまに変な音出るけど、それも味だよ。",
    itemType: "ギター",
    usedYears: "15年",
    user: { name: "Tatekin", avatar: "/moc/user/tatekin.webp" },
    likes: 45,
    date: "1日前",
  },
  {
    id: 5,
    image: "/moc/forest/5.jpg",
    name: "夢綴ノ書",
    description: "このノートは、夢と妄想の倉庫。起業アイデア、小説の構想、未来の家の間取り図……ときには「ラーメン自販機チェーンで一攫千金」みたいなネタも。ページをめくるたびに、あの頃の情熱がよみがえる。ありがとう、夢綴ノ書。君のおかげで、現実をちょっとだけ好きになれた。",
    itemType: "ノート",
    usedYears: "3年",
    user: { name: "Goma", avatar: "/moc/user/goma.webp" },
    likes: 29,
    date: "2週間前",
  },
  {
    id: 6,
    image: "/moc/forest/6.jpg",
    name: "光背の石板",
    description: "大学1年の冬、バイト代をためて買った初めてのPC。あのときのワクワクは今でも忘れられない。レポート作成から恋のメッセージ、YouTubeでの徹夜鑑賞まで、全部この石板でやった。最近は動きが遅くて冷蔵庫よりもうるさいけど、本当にありがとう。君と過ごした時間は、まるで魔法のようだった。",
    itemType: "PC",
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
    name: "灯影の杖",
    description: "一人暮らしを始めた日、初めて部屋に灯ったのがこの照明だった。夜中に怖くてつけっぱなしにしたことも、恋人とロマンチックな夜を演出したこともあったなあ（今はいないけど）。部屋を温かく照らしてくれてありがとう。次の場所でも、優しい光を灯してね。",
    itemType: "照明",
    usedYears: "6年",
    user: { name: "Minami", avatar: "/moc/user/minami.webp" },
    likes: 33,
    date: "1日前",
  },
  {
    id: 9,
    image: "/moc/forest/9.jpg",
    name: "語り部の頁",
    description: "20年分の物語がこの本棚に詰まってる。ファンタジーからミステリー、時には料理本。登場人物たちと共に笑い、泣き、成長してきた。もうページが黄ばんでいるけど、その古さが愛しい。ありがとう、本たち。君たちの物語は、私の人生の一部だったよ。",
    itemType: "本",
    usedYears: "20年",
    user: { name: "Tsunodashi", avatar: "/moc/user/tsunodashi.webp" },
    likes: 51,
    date: "今日",
  },
  {
    id: 10,
    image: "/moc/forest/10.jpg",
    name: "炎舞の釜",
    description: "この鍋で作った料理は数知れず。最強の無水鍋！こげつきがひどいから、新しいのを買おう。今までありがとう！",
    itemType: "鍋",
    usedYears: "10年",
    user: { name: "Nijihagi", avatar: "/moc/user/nijihagi.webp" },
    likes: 12,
    date: "1時間前",
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
  const sortedPosts = [...discardPosts]
  if (sortBy === "popular") {
    sortedPosts.sort((a, b) => b.likes - a.likes)
  } else {
    sortedPosts.sort((a, b) => b.id - a.id)
  }

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
