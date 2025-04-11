"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, FastForward } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Base component structure without any dynamic content
const StaticPrologueBase = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <Image
      src="/map.png"
      alt="Background"
      fill
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 bg-green-900/80" />
    <div className="max-w-md w-full bg-gradient-to-b from-green-900/90 to-green-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6 sm:p-8 rounded-xl relative">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>
      <div className="text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-300 tracking-tight drop-shadow-[0_0_8px_rggba(251,191,36,0.7)]">
          乱れしクローゼット王国
        </h1>
        <p className="text-amber-300/80 text-sm sm:text-base">物語を始めるには以下のボタンをクリックしてください</p>
        <div className="w-full sm:w-auto bg-green-800 text-amber-300 font-medium py-2 px-4 rounded-lg border border-green-600">
          物語を始める
        </div>
        <p className="text-xs text-amber-300/60 mt-4">※以降、効果音が鳴ります（音楽：魔王魂）</p>
      </div>
    </div>
  </div>
)

// Dynamic component that will only be rendered on the client
const DynamicPrologue = () => {
  const [stage, setStage] = useState(0)
  const [prevStage, setPrevStage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stageTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [stageProgress, setStageProgress] = useState(0) // 0-100 for progress within a stage
  const [autoAdvance, setAutoAdvance] = useState(true) // Control auto advancement

  // Story text for each stage
  const storyTexts = [
    "",
    "かつて、クローゼット王国は調和と美しさに満ちた世界でした。\nすべての衣装や小物は、まるで魔法のようにその居場所を知り、王国は輝いていたのです。",
    "しかし、ある日、突如として現れた『混沌の呪い』が王国に暗い影を落としました。\n棚は乱れ、衣装は迷宮のごとく入り組み、かつての秩序は音を立てて崩れ去っていったのです。",
    "勇者よ、あなたにのみ託された使命がある。\n散らかり果てた王国に再び秩序をもたらし、失われた美しさを取り戻すのです。",
    "ここからあなたは、勇者として、各エリアに潜む混沌を一掃するための旅に出ます。\n初めは小さなクエストから始まり、ひとつひとつの達成があなたを強くします。\nそしてクローゼット王国が再び輝きを取り戻すまさにその時、あなたは国を統治する偉大な王になるのです。\n\nさぁ選ばれし勇者よ、行ってらっしゃい！",
    "",
  ]

  // Particle sets for each stage
  const stageParticles = {
    1: ["✨", "❤️", "💫", "💕", "🌟"], // Harmony and beauty
    2: ["💀", "🍂", "🌑", "⚡", "🕸️"], // Chaos and darkness
    3: ["🧦", "👕", "👗", "🧣", "🧤"], // Clothing items
    4: ["🗡️", "🔮", "⏱️", "🛡️", "📜"], // Adventure items
    5: ["✨", "🎉", "🎊", "🏆", "👑"], // Celebration
  }

  // Split text into paragraphs for display
  const splitTextIntoParagraphs = (text: string) => {
    return text.split("\n").filter((p) => p.trim() !== "")
  }

  // Background colors for each stage
  const bgColors = [
    "bg-green-950", // Initial
    "bg-gradient-to-br from-green-400 to-green-500", // Stage 1
    "bg-gray-800", // Stage 2
    "bg-green-900", // Stage 3
    "bg-green-800", // Stage 4
    "bg-green-700", // Final
  ]

  // Handle smooth stage transitions
  useEffect(() => {
    if (stage !== prevStage) {
      setIsTransitioning(true)

      // After transition completes, update prevStage
      const transitionTimer = setTimeout(() => {
        setPrevStage(stage)
        setIsTransitioning(false)
      }, 1000) // Match this with the transition duration

      return () => clearTimeout(transitionTimer)
    }
  }, [stage, prevStage])

  // Clear all timers
  const clearAllTimers = () => {
    if (stageTimerRef.current) {
      clearTimeout(stageTimerRef.current)
      stageTimerRef.current = null
    }
  }

  // Handle stage transitions and progress
  useEffect(() => {
    // Clear any existing timers when stage changes
    clearAllTimers()

    if (stage > 0 && stage < 6) {
      console.log(`Showing stage ${stage}`)
      setStageProgress(0)

      // Update progress every 100ms
      const progressInterval = setInterval(() => {
        setStageProgress((prev) => {
          if (prev < 100) {
            return prev + 1
          } else {
            clearInterval(progressInterval)
            // Auto-advance to stage 5 when stage 4 progress reaches 100%
            if (stage === 4) {
              setTimeout(() => {
                setStage(5)
              }, 2000) // Wait 2 seconds before advancing to give time to read
            }
            return 100
          }
        })
      }, 80) // 8 seconds total duration (80ms * 100)

      // Auto advance to next stage after a delay (for stages 1-3)
      if (stage < 4) {
        stageTimerRef.current = setTimeout(() => {
          console.log(`Advancing to stage ${stage + 1}`)
          clearInterval(progressInterval)
          if (stage < 5) {
            setStage(stage + 1)
          }
        }, 8000) // Show each stage for 8 seconds
      }

      return () => {
        clearInterval(progressInterval)
      }
    }

    // Cleanup function
    return () => {
      clearAllTimers()
    }
  }, [stage])

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/prologue.mp3")
    audioRef.current.loop = true

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle audio play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, isMuted])

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  // Skip animation
  const skipAnimation = () => {
    clearAllTimers()
    setStage(5)
  }

  // Start the prologue
  const startPrologue = () => {
    setIsPlaying(true)
    setStage(1)
  }

  // Continue to character creation
  const continueToCharacterCreation = () => {
    setStage(5)
  }

  // Get paragraphs for current stage
  const currentParagraphs = stage > 0 && stage < 5 ? splitTextIntoParagraphs(storyTexts[stage]) : []

  // Floating particles for background effect based on current stage
  const renderParticles = (forStage: number) => {
    if (forStage === 0 || !stageParticles[forStage as keyof typeof stageParticles]) return null

    const particles = stageParticles[forStage as keyof typeof stageParticles]

    return Array.from({ length: 20 }).map((_, i) => {
      const particle = particles[Math.floor(Math.random() * particles.length)]
      const size = Math.random() * 20 + 10
      const opacity = Math.random() * 0.3 + 0.1
      const duration = Math.random() * 5 + 3
      const delay = Math.random() * 2

      return (
        <div
          key={i}
          className="absolute animate-float-animation"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${size}px`,
            opacity: opacity,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          {particle}
        </div>
      )
    })
  }

  // Function to render paragraphs with special styling for the final line
  const renderParagraphs = (paragraphs: string[]) => {
    return paragraphs.map((paragraph, index) => {
      // Check if this is the last paragraph of stage 4 and contains the target text
      if (
        stage === 4 &&
        index === paragraphs.length - 1 &&
        paragraph.includes("さぁ選ばれし勇者よ、行ってらっしゃい！")
      ) {
        // Split the paragraph to isolate the target text
        const parts = paragraph.split("さぁ選ばれし勇者よ、行ってらっしゃい！")
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.5 }}
            className="animate-magical-appear"
          >
            {parts[0]}
            <motion.span
              className="text-xl font-bold text-[#f0c96b] drop-shadow-[0_0_8px_rgba(240,201,107,0.8)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.5 + 0.3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              さぁ選ばれし勇者よ、行ってらっしゃい！
            </motion.span>
            {parts[1]}
          </motion.p>
        )
      }

      return (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.5 }}
          className="text-amber-300/80 animate-magical-appear"
        >
          {paragraph}
        </motion.p>
      )
    })
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-1000 ${bgColors[stage]}`}>
      <Image
        src="/map.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-green-900/80" />
      {/* Background particles - previous stage */}
      {prevStage > 0 && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none z-1"
          style={{ opacity: isTransitioning ? 0 : 1, transition: "opacity 1000ms ease-in-out" }}
        >
          {renderParticles(prevStage)}
        </div>
      )}

      {/* Background particles - current stage */}
      {stage > 0 && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none z-1"
          style={{ opacity: isTransitioning ? 1 : 0, transition: "opacity 1000ms ease-in-out" }}
        >
          {renderParticles(stage)}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        {/* Progress bar */}
        {stage > 0 && stage < 5 && (
          <div className="fixed top-4 left-4 w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-300 transition-all duration-300 ease-linear"
              style={{ width: `${stageProgress}%` }}
            ></div>
          </div>
        )}

        {/* Audio controls */}
        {stage > 0 && (
          <div className="fixed top-4 right-4 flex gap-2 z-20">
            <Button
              variant="outline"
              size="icon"
              className="bg-green-800 border-green-600 text-white hover:bg-green-700"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="bg-green-800 border-green-600 text-white hover:bg-green-700"
              onClick={skipAnimation}
            >
              <FastForward className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Content container */}
        <div className="max-w-md w-full bg-gradient-to-b from-green-900/90 to-green-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6 sm:p-8 rounded-xl relative">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>
          {/* Stage 0: Initial screen */}
          {stage === 0 && (
            <div className="text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-300 tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]">
                クローゼット王国
              </h1>
              <p className="text-amber-300/80 text-sm sm:text-base">ボタンを押して物語を始めよう</p>
              <Button
                className="w-full sm:w-auto bg-[#f0c96b] hover:bg-[#e0b95b] text-green-900 drop-shadow-[0_0_5px_rgba(240,201,107,0.7)] font-medium py-4 px-8 rounded-lg border border-[#d8b85a] text-lg sm:text-xl"
                onClick={startPrologue}
              >
                物語を始める
              </Button>
              <p className="text-s text-amber-300/60 mt-4">※以降、効果音が鳴ります（音楽：魔王魂）</p>
            </div>
          )}

          {/* Stage 1-4: Story narration */}
          {stage > 0 && stage < 5 && (
            <div className="text-center space-y-4">
              {stage === 1 && (
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] mb-6 animate-magical-appear">
                  美しいクローゼット王国
                </h2>
              )}

              {stage === 2 && (
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] mb-6 animate-magical-appear">
                  突然訪れた混沌の呪い
                </h2>
              )}

              {stage === 4 && (
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] mb-6 animate-magical-appear">
                  冒険の始まり
                </h2>
              )}

              {stage === 3 && (
                <div className="flex justify-center mb-4 animate-magical-appear">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.7)]">
                    <Image src="/cow-fairy.webp" alt="片付けの妖精モーちゃん" fill className="object-cover" />
                  </div>
                </div>
              )}

              {stage === 3 && (
                <h3 className="text-xl font-bold text-amber-300 mb-2 animate-magical-appear">
                  片付けの妖精モーちゃん
                </h3>
              )}

              <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                <div className="text-amber-300/80 text-sm sm:text-base whitespace-pre-line text-left space-y-2">
                  <AnimatePresence mode="wait">
                    {renderParagraphs(currentParagraphs)}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {/* Stage 5: Final screen */}
          {stage === 5 && (
            <div className="text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear">
                さぁ、冒険を始めよう！
              </h2>
              <Link href="/createname" className="block animate-magical-appear" style={{ animationDelay: "0.5s" }}>
                <Button className="w-full sm:w-auto bg-[#f0c96b] hover:bg-[#e0b95b] text-green-900 drop-shadow-[0_0_5px_rgba(240,201,107,0.7)] font-medium py-4 px-8 rounded-lg border border-[#d8b85a] text-lg sm:text-xl transition-colors duration-200">
                  冒険の準備を始める
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main component that handles client/server rendering
export default function ProloguePage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // On the server, render the static base
  // On the client, replace it with the dynamic component
  return isClient ? <DynamicPrologue /> : <StaticPrologueBase />
}

