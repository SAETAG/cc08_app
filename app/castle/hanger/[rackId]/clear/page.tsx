"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Sparkles, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"
import { firebaseAuth } from "@/lib/firebase"

type PageParams = {
  rackId: string
}

export default function DungeonClearPage() {
  const router = useRouter()
  const params = useParams() as PageParams
  const [dialogueIndex, setDialogueIndex] = useState(-1)
  const [showDungeons, setShowDungeons] = useState(false)
  const [activeDungeon, setActiveDungeon] = useState(-1)
  const [showBeforeAfter, setShowBeforeAfter] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [selectedQuotes, setSelectedQuotes] = useState<typeof wisdomQuotes>([])
  const [beforeImageUrl, setBeforeImageUrl] = useState<string>("")
  const [afterImageUrl, setAfterImageUrl] = useState<string>("")

  const dialogues = [
    "勇者よ……",
    "よくぞ、ここまで頑張った……！",
    "あなたの勇気と努力に、最大限の敬意を払う",
    "もう今のあなたになら、分かるはずだ…",
    "モノは、私たちを幸せにしてくれる",
    "でも時として、私たちを振り回し、不幸にもする",
    "それらを治めるのは、他でもない、あなただ",
    "これからもあなたの冒険は続く",
    "これからの旅のお供に",
    "過去の勇者たちからの、メッセージを授けよう",
  ]

  const wisdomQuotes = [
    { text: "すべてのモノに、理由がある。", emoji: "👘" },
    { text: "「好き」は、片づけの最強スキル。", emoji: "🫶" },
    { text: "未来で使うは、ほぼ使わぬ。", emoji: "🌠" },
    { text: "一度も戦わなかった装備は、旅に必要ない。", emoji: "⚔️" },
    { text: "とりあえず取っておく。それが魔の呪文である。", emoji: "🧛" },
    { text: "探し物は、心の迷子でもある。", emoji: "🔍" },
    { text: "空間の乱れは、思考の乱れ。", emoji: "🌀" },
    { text: "収納とは、モノの定位置に与える「住所」である。", emoji: "🏰" },
    { text: "「いつか使う」は、「今じゃない」の証明。", emoji: "⏳" },
    { text: "捨てることは、選ぶこと。", emoji: "🎯" },
    { text: "本当に必要なものは、案外少ない。", emoji: "💎" },
    { text: "箱を増やせば、迷いも増える。", emoji: "📦" },
    { text: "思い出は心に、モノは軽く。", emoji: "👒" },
    { text: "あなたの城（部屋）は、あなたの鏡である。", emoji: "🪞" },
    { text: "すぐに取れぬモノは、すぐに使えぬモノ。", emoji: "⏱️" },
    { text: "モノを減らすと、時間が増える。", emoji: "⏰" },
    { text: "「まだ使える」は、「もう使っていない」の裏返し。", emoji: "🔄" },
    { text: "クローゼットは、あなたの冒険の準備室だ。", emoji: "👕" },
    { text: "手放すとは、別れではなく感謝。", emoji: "🙏" },
    { text: "「なんとなく置く」は、混沌の入口。", emoji: "🌪️" },
    { text: "整理とは、問い直すこと。", emoji: "❓" },
    { text: "1日15分の積み重ねが、王国を救う。", emoji: "👑" },
    { text: "服に着られるな、服を使いこなせ。", emoji: "👗" },
    { text: "量より質、数より意味。", emoji: "⚖️" },
    { text: "空いたスペースには、余白の魔力が宿る。", emoji: "🌌" },
    { text: "収納とは、心を整える術でもある。", emoji: "🧘‍♂️" },
    { text: "さあ、今日もひとつ、「ととのえ」の一手を。", emoji: "✨" },
    { text: "「床置き」は、一度許すと仲間を呼ぶ。", emoji: "🧟‍♂️" },
    { text: "「とりあえず」が積もると、「もう手遅れ」になる。", emoji: "🗑️" },
    { text: "クローゼットは、過去と未来の交差点。", emoji: "🌉" },
    { text: "整理とは、過去への弔いと未来への準備である。", emoji: "⚰️" },
    { text: "「片づけたい」は、「自分を整えたい」のサイン。", emoji: "💪" },
    { text: "モノに埋もれる者、意思を失う。", emoji: "🪦" },
    { text: "汝、ハンガーの数を超えてモノを持つべからず。", emoji: "📏" },
    { text: "一軍だけを残せ、控えはもう来ない。", emoji: "⚽" },
    { text: "「誰かにあげるかも」は、大体あげない。", emoji: "🙅‍♂️" },
    { text: "「高かったから」は、すでにコスト。", emoji: "💸" },
    { text: "君はモノを選んでいるようで、選ばれているのかもしれない。", emoji: "🎭" },
    { text: "「片づいた」の定義は、人の数だけある。", emoji: "🙆" },
    { text: "モノの置き場は、あなたの決断力の棚卸し。", emoji: "📚" },
    { text: "汝の「欲しい！」は、三ヶ月で消えることもある。", emoji: "🚀" },
    { text: "部屋はあなたの「思考のカタチ」を映す鏡である。", emoji: "🧩" },
    { text: "その人との思い出は、モノの中にはいない。", emoji: "🕊️" },
    { text: "モノは「気持ちの届け物」。受け取ったら、手放しても大丈夫。", emoji: "🎁" },
    { text: "感謝は持ち続けなくていい。「ありがとう」で次に進めばいい。", emoji: "🌸" },
    { text: "人は「モノ」を贈ったのではない、「気持ち」を贈ったのだ。", emoji: "💌" },
    { text: "あなたが笑顔でいることが、いちばんの「お返し」になる。", emoji: "😊" },
    { text: "手放すことは、裏切りではない。「選ぶ」という誠実さである。", emoji: "🦄" },
    { text: "すべてを抱えたままでは、新しいものは入らない。", emoji: "🧜‍♀️" },
    { text: "そのモノの役目は、もう終わっただけ。", emoji: "📜" },
    { text: "「もったいない」は、使ってこそ活きる呪文。", emoji: "🧙‍♀️" },
    { text: "「ごめんね」より、「ありがとう」。それが別れの魔法。", emoji: "🪶" },
    { text: "モノが残っているのは、過去の自分の声がまだそこにあるから。", emoji: "👄" },
    { text: "捨てたあとに残るのは、「後悔」ではなく、「軽さ」である。", emoji: "💃" },
    { text: "勇気は、袋に入れて出すものではない。「選ぶ」ときに使うものだ。", emoji: "🛡️" },
    { text: "持ちすぎる優しさは、自分を押しつぶすこともある。", emoji: "💔" },
    { text: "「もったいない」と感じるその心、すでに素晴らしい。", emoji: "🌱" },
  ]

  const dungeons = [
    { color: "from-purple-600 to-purple-500" },
    { color: "from-blue-600 to-blue-500" },
    { color: "from-emerald-600 to-emerald-500" },
    { color: "from-amber-600 to-amber-500" },
    { color: "from-purple-600 to-purple-500" },
  ]

  const beforeAfterPairs = [
    {
      before: "/overflowing-hallway-chaos.png",
      after: "/welcoming-closet-nook.png",
    },
  ]

  useEffect(() => {
    // Character appears
    const timer0 = setTimeout(() => setDialogueIndex(0), 1000)

    // Dialogue sequence
    const timer1 = setTimeout(() => setDialogueIndex(1), 4000)
    const timer2 = setTimeout(() => setDialogueIndex(2), 7000)
    const timer3 = setTimeout(() => setDialogueIndex(3), 10000)
    const timer4 = setTimeout(() => setDialogueIndex(4), 13000)
    const timer5 = setTimeout(() => setDialogueIndex(5), 16000)
    const timer6 = setTimeout(() => setDialogueIndex(6), 19000)
    const timer7 = setTimeout(() => setDialogueIndex(7), 22000)
    const timer8 = setTimeout(() => setDialogueIndex(8), 25000)
    const timer9 = setTimeout(() => setDialogueIndex(9), 28000)

    // Fade out last dialogue and show dungeons
    const timer10 = setTimeout(() => {
      setDialogueIndex(-1)
      setShowDungeons(true)
    }, 31000)

    // Cycle through dungeons one by one
    const timer11 = setTimeout(() => setActiveDungeon(0), 31500)
    const timer12 = setTimeout(() => setActiveDungeon(1), 38500)
    const timer13 = setTimeout(() => setActiveDungeon(2), 45500)
    const timer14 = setTimeout(() => setActiveDungeon(3), 52500)
    const timer15 = setTimeout(() => setActiveDungeon(4), 59500)

    // End dungeon sequence
    const timer16 = setTimeout(() => {
      setActiveDungeon(-1)
      setShowDungeons(false)
    }, 66500)

    // Show before/after
    const timer17 = setTimeout(() => {
      setShowBeforeAfter(true)
    }, 67000)

    // Show congratulations
    const timer18 = setTimeout(() => setShowCongrats(true), 71000)

    // Show button
    const timer19 = setTimeout(() => setShowButton(true), 73000)

    return () => {
      clearTimeout(timer0)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
      clearTimeout(timer6)
      clearTimeout(timer7)
      clearTimeout(timer8)
      clearTimeout(timer9)
      clearTimeout(timer10)
      clearTimeout(timer11)
      clearTimeout(timer12)
      clearTimeout(timer13)
      clearTimeout(timer14)
      clearTimeout(timer15)
      clearTimeout(timer16)
      clearTimeout(timer17)
      clearTimeout(timer18)
      clearTimeout(timer19)
    }
  }, [])

  useEffect(() => {
    // オーディオの初期化
    const newAudio = new Audio('/endroll.mp3')
    newAudio.loop = true
    setAudio(newAudio)

    // ページ遷移時のクリーンアップ
    const handleRouteChange = () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }

    // ページ遷移イベントのリスナーを追加
    window.addEventListener('beforeunload', handleRouteChange)

    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
      // イベントリスナーを削除
      window.removeEventListener('beforeunload', handleRouteChange)
    }
  }, [])

  useEffect(() => {
    if (audio) {
      if (isSoundOn) {
        audio.play()
      } else {
        audio.pause()
      }
    }
  }, [isSoundOn, audio])

  useEffect(() => {
    // ランダムに5つの格言を選択
    const shuffled = [...wisdomQuotes].sort(() => 0.5 - Math.random())
    setSelectedQuotes(shuffled.slice(0, 5))
  }, [])

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const idToken = await firebaseAuth.currentUser?.getIdToken()
        if (!idToken) return

        // ビフォー写真の取得
        const beforeResponse = await fetch(`/api/racks/${params.rackId}/getbeforeimage`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
        const beforeData = await beforeResponse.json()
        if (beforeData.beforeImageUrl) {
          setBeforeImageUrl(beforeData.beforeImageUrl)
        }

        // アフター写真の取得
        const afterResponse = await fetch(`/api/racks/${params.rackId}/getafterimage`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
        const afterData = await afterResponse.json()
        console.log("アフター写真のレスポンス:", afterData)
        if (afterData.afterimageUrl) {
          setAfterImageUrl(afterData.afterimageUrl)
        }
      } catch (error) {
        console.error("写真の取得に失敗しました:", error)
      }
    }

    fetchImages()
  }, [params.rackId])

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn)
  }

  const handleEndAdventure = async () => {
    try {
      // PlayFabにデータを保存
      const playfabResponse = await fetch("/api/updateUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: `rack_${params.rackId}_status`,
          value: true
        }),
      })

      if (!playfabResponse.ok) {
        const error = await playfabResponse.json()
        throw new Error(error.error || "データの更新に失敗しました")
      }

      // 成功したらクローゼット城に戻る
      router.push("/castle")
    } catch (error) {
      console.error("Error updating PlayFab data:", error)
      alert(error instanceof Error ? error.message : "エラーが発生しました")
    }
  }

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
      {/* Elegant gold square outlines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => {
          const size = Math.random() * 100 + 50
          return (
            <motion.div
              key={`square-${i}`}
              className="absolute border border-amber-400/30"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                borderWidth: "1px",
              }}
              initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.4, 0],
                rotate: [0, 90, 180],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: Math.random() * 10,
              }}
            />
          )
        })}

        {/* Nested squares */}
        {Array.from({ length: 8 }).map((_, i) => {
          const size = Math.random() * 120 + 80
          return (
            <motion.div
              key={`nested-square-${i}`}
              className="absolute"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, rotate: 45 }}
              animate={{
                opacity: [0, 0.3, 0],
                rotate: [45, 135, 45],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: Math.random() * 10,
              }}
            >
              <div className="absolute inset-0 border border-amber-500/20" />
              <div className="absolute inset-[15%] border border-amber-400/25" />
              <div className="absolute inset-[30%] border border-amber-300/30" />
            </motion.div>
          )
        })}

        {/* Diagonal lines */}
        {Array.from({ length: 10 }).map((_, i) => {
          const length = Math.random() * 150 + 50
          const thickness = Math.random() > 0.7 ? 2 : 1
          return (
            <motion.div
              key={`line-${i}`}
              className="absolute bg-amber-400/20"
              style={{
                width: length,
                height: thickness,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transformOrigin: "center",
              }}
              initial={{ opacity: 0, rotate: Math.random() * 180, scale: 0 }}
              animate={{
                opacity: [0, 0.3, 0],
                rotate: [Math.random() * 180, Math.random() * 180 + 180, Math.random() * 180 + 360],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: Math.random() * 5,
              }}
            />
          )
        })}
      </div>

      {/* Light effects - matching HangerList style */}
      <div className="absolute left-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"></div>
      <div
        className="absolute right-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="w-full max-w-5xl z-10 mt-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/castle/hanger/${params.rackId}`}
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>ハンガーラックに戻る</span>
          </Link>
          <button
            onClick={toggleSound}
            className="text-amber-400 hover:text-amber-300 transition-colors p-2"
          >
            {isSoundOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </button>
        </div>

        <div className="relative z-30 flex flex-col items-center justify-center w-full">
          {/* Initial Mō-chan character and dialogue */}
          <AnimatePresence mode="wait">
            {dialogueIndex >= 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="flex flex-col items-center mb-8"
              >
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                  <Image src="/cow-fairy.webp" alt="モーちゃん" fill className="object-contain rounded-full" priority />
                </div>

                {/* Initial Dialogue box - styled like HangerList */}
                <AnimatePresence mode="wait">
                  {dialogueIndex >= 0 && (
                    <motion.div
                      key={`dialogue-${dialogueIndex}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] rounded-xl p-6 mt-8 w-full max-w-md"
                    >
                      <p className="text-amber-300 text-xl font-medium text-center leading-relaxed">
                        {dialogues[dialogueIndex]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full-screen dungeon cards - styled like HangerList cards */}
          {showDungeons && (
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <AnimatePresence mode="wait">
                {activeDungeon >= 0 && (
                  <motion.div
                    key={`dungeon-card-${activeDungeon}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1.5, type: "spring" }}
                    className="w-full max-w-2xl mx-auto px-4"
                  >
                    <div
                      className={`relative bg-gradient-to-r ${dungeons[activeDungeon].color} p-8 rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.3)] border-2 border-amber-500/50 backdrop-blur-sm`}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl">
                        {/* Sparkles */}
                        {Array.from({ length: 20 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute rounded-full bg-amber-500/30 blur-sm"
                            style={{
                              width: Math.random() * 6 + 2,
                              height: Math.random() * 6 + 2,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              opacity: [0, 0.8, 0],
                              scale: [0, 1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: 1,
                              delay: Math.random() * 2,
                            }}
                          />
                        ))}

                        {/* Light beam */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: 1,
                            repeatType: "loop",
                          }}
                        />
                      </div>

                      {/* Card content */}
                      <div className="relative z-10">
                        {/* Emoji */}
                        <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                          className="text-8xl md:text-9xl mb-4 text-center"
                        >
                          {selectedQuotes[activeDungeon]?.emoji}
                        </motion.div>

                        {/* Quote */}
                        <motion.h2
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="text-2xl md:text-3xl font-bold text-amber-300 text-center mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] italic"
                        >
                          {selectedQuotes[activeDungeon]?.text}
                        </motion.h2>

                        {/* Decorative line */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                          className="h-1 bg-amber-500/50 rounded-full my-4"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Before/After photos - styled like HangerList cards */}
          <AnimatePresence>
            {showBeforeAfter && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-4xl mx-auto"
              >
                <motion.div
                  className="relative bg-gradient-to-b from-blue-900/90 to-blue-950/90 p-8 rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.3)] border-2 border-amber-500/50 overflow-hidden"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  {/* Gold ornate border with magical glow */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Corner decorations - more delicate */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-amber-500/40" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-amber-500/40" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-amber-500/40" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-amber-500/40" />

                    {/* Magical energy glow */}
                    <div className="absolute inset-0 bg-amber-500/5 mix-blend-overlay" />
                  </div>

                  {/* Photos */}
                  <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    <div className="flex-1 relative">
                      {/* Ancient gold label */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm px-4 py-1 z-10 rounded-sm border border-amber-400/50 font-medium uppercase tracking-wider shadow-lg">
                        Before
                      </div>

                      {/* Photo without frame */}
                      <div className="relative">
                        {/* Subtle glow effect */}
                        <div className="absolute -inset-1 bg-amber-500/20 blur-sm rounded-lg"></div>

                        {/* Photo directly without frame */}
                        <div className="relative h-60 w-full overflow-hidden rounded-lg">
                          <Image
                            src={beforeImageUrl || "/placeholder.svg"}
                            alt="Before"
                            fill
                            className="object-cover"
                          />

                          {/* Magical overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent mix-blend-overlay" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 relative">
                      {/* Ancient gold label */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm px-4 py-1 z-10 rounded-sm border border-amber-400/50 font-medium uppercase tracking-wider shadow-lg">
                        After
                      </div>

                      {/* Photo without frame */}
                      <div className="relative">
                        {/* Subtle glow effect */}
                        <div className="absolute -inset-1 bg-amber-500/20 blur-sm rounded-lg"></div>

                        {/* Photo directly without frame */}
                        <div className="relative h-60 w-full overflow-hidden rounded-lg">
                          <Image
                            src={afterImageUrl || "/placeholder.svg"}
                            alt="After"
                            fill
                            className="object-cover"
                          />

                          {/* Magical overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent mix-blend-overlay" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gold magical energy effects */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 pointer-events-none"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Congratulations text with glow but without falling sparkles */}
          <AnimatePresence>
            {showCongrats && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                }}
                className="mt-8 mb-6 relative"
              >
                {/* Sparkle burst effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.5] }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl z-0"
                />

                {/* Main text with animated glow */}
                <motion.h1
                  className="relative z-10 text-4xl md:text-5xl font-bold text-center text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(251,191,36,0.5)",
                      "0 0 20px rgba(251,191,36,0.8)",
                      "0 0 10px rgba(251,191,36,0.5)",
                    ],
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  ダンジョンクリア！おめでとう✨！
                </motion.h1>

                {/* Radial light rays */}
                <motion.div
                  className="absolute inset-0 z-0 opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.3)_0%,_transparent_70%)]" />
                </motion.div>

                {/* Pulsing ring */}
                <motion.div
                  className="absolute inset-0 border-2 border-amber-400/30 rounded-full z-0"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* End adventure button - styled like HangerList */}
          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEndAdventure}
                className="mt-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-3 px-8 rounded-lg shadow-lg border border-amber-400/30 flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>この冒険を終了する</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
