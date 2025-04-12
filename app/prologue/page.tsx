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
  const [stageProgress, setStageProgress] = useState(0)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [displayedText, setDisplayedText] = useState<string[]>([])

  // Story text for each stage
  const storyTexts = [
    "",
    "かつて、クローゼット王国は光輝く調和の世界だった。\n衣装も小物も、魔法のように納まっていた。",
    "だが突如、『混沌の呪い』が王国を蝕んだ。\n秩序は崩壊し、王国は迷宮と化した…",
    "勇者よ、使命はただ一つ。\n王国に再び秩序と美を取り戻すのだ！",
    "さあ、冒険は始まった。 \n毎日の積み重ねが、偉大な王への道を拓く。\n選ばれし者よ、いざ、クローゼット王国へ！",
    "",
  ]

  // Background colors for each stage
  const bgColors = [
    "bg-green-950", // Initial
    "bg-gradient-to-br from-green-400 to-green-500", // Stage 1
    "bg-gray-800", // Stage 2
    "bg-green-900", // Stage 3
    "bg-green-800", // Stage 4
    "bg-green-700", // Final
  ]

  // Background overlay colors for each stage
  const overlayColors = [
    "bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-green-900/80", // Initial
    "bg-gradient-to-br from-purple-900/80 via-red-900/80 to-orange-900/80", // Stage 1
    "bg-gradient-to-br from-purple-950/80 to-gray-900/80", // Stage 2
    "bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-green-900/80", // Stage 3
    "bg-gradient-to-br from-green-900/80 via-blue-900/80 to-purple-900/80", // Stage 4
    "bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-green-900/80", // Final
  ]

  // Handle smooth stage transitions
  useEffect(() => {
    if (stage !== prevStage) {
      setIsTransitioning(true)

      // After transition completes, update prevStage
      const transitionTimer = setTimeout(() => {
        setPrevStage(stage)
        setIsTransitioning(false)
      }, 500) // 1000msから500msに短縮

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
              }, 1000) // 2000msから1000msに短縮
            }
            return 100
          }
        })
      }, 60) // 80msから60msに短縮

      // Auto advance to next stage after a delay (for stages 1-3)
      if (stage < 4) {
        stageTimerRef.current = setTimeout(() => {
          console.log(`Advancing to stage ${stage + 1}`)
          clearInterval(progressInterval)
          if (stage < 5) {
            setStage(stage + 1)
          }
        }, 6000) // 8000msから6000msに短縮
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

  // Handle text typing animation
  useEffect(() => {
    if (stage > 0 && stage < 5) {
      const paragraphs = storyTexts[stage].split("\n").filter((p) => p.trim() !== "")
      setDisplayedText([])
      
      let totalDelay = 0
      paragraphs.forEach((paragraph, paragraphIndex) => {
        let currentText = ""
        const characters = paragraph.split("")
        
        // 前の段落の文字数分の遅延を計算（70ms per character）
        if (paragraphIndex > 0) {
          totalDelay += paragraphs[paragraphIndex - 1].length * 70
        }
        
        // ステージ4（冒険の始まり）の場合は段落間の遅延を短くする
        const paragraphDelay = stage === 4 ? 300 : 1000
        
        characters.forEach((char, charIndex) => {
          setTimeout(() => {
            currentText += char
            setDisplayedText(prev => {
              const newText = [...prev]
              newText[paragraphIndex] = currentText
              return newText
            })
          }, totalDelay + (paragraphIndex * paragraphDelay) + (charIndex * 70))
        })
      })
    }
  }, [stage])

  // Get paragraphs for current stage
  const currentParagraphs = stage > 0 && stage < 5 ? storyTexts[stage].split("\n").filter((p) => p.trim() !== "") : []

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-1000 ${bgColors[stage]}`}>
      <Image
        src="/map.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className={`absolute inset-0 ${overlayColors[stage]}`} />
      
      {/* 魔法の装飾模様 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 大きな装飾 */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-amber-400/20 transform rotate-12"></div>
        <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-amber-300/30 transform -rotate-6"></div>
        
        {/* 画面全体を覆う装飾 */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-400/10 transform rotate-3"></div>
        <div className="absolute top-4 left-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] border-2 border-amber-300/20 transform -rotate-1"></div>
        
        {/* 左上の装飾 */}
        <div className="absolute top-10 left-10 w-24 h-24 border-2 border-amber-400/30 transform rotate-45"></div>
        <div className="absolute top-16 left-16 w-12 h-12 border border-amber-300/40 transform rotate-12"></div>
        
        {/* 右上の装飾 */}
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-amber-400/30 transform -rotate-45"></div>
        <div className="absolute top-20 right-20 w-8 h-8 border border-amber-300/40 transform -rotate-12"></div>
        
        {/* 左下の装飾 */}
        <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-amber-400/30 transform rotate-12"></div>
        <div className="absolute bottom-20 left-20 w-10 h-10 border border-amber-300/40 transform -rotate-45"></div>
        
        {/* 右下の装飾 */}
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-amber-400/30 transform -rotate-12"></div>
        <div className="absolute bottom-16 right-16 w-14 h-14 border border-amber-300/40 transform rotate-45"></div>
        
        {/* 中央の装飾 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-amber-400/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-amber-300/30 rounded-full"></div>
      </div>

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
              className="bg-gradient-to-br from-purple-950/95 via-blue-950/95 to-green-950/95 border-amber-500/50 text-white hover:bg-gradient-to-br hover:from-purple-900/95 hover:via-blue-900/95 hover:to-green-900/95"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="bg-gradient-to-br from-purple-950/95 via-blue-950/95 to-green-950/95 border-amber-500/50 text-white hover:bg-gradient-to-br hover:from-purple-900/95 hover:via-blue-900/95 hover:to-green-900/95"
              onClick={skipAnimation}
            >
              <FastForward className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Content container */}
        <div className="max-w-md w-full bg-gradient-to-br from-purple-950/95 via-blue-950/95 to-green-950/95 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6 sm:p-8 rounded-xl relative">
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
                <div className="text-white text-sm sm:text-base whitespace-pre-line text-left space-y-2">
                  <AnimatePresence mode="wait">
                    {displayedText.map((text, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-white text-xl font-medium text-center leading-relaxed"
                      >
                        {text}
                        <span className="animate-pulse">|</span>
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {/* Stage 5: Final screen */}
          {stage === 5 && (
            <div className="text-center space-y-6">
              <div className="mb-8">
                <h2 className="text-6xl sm:text-7xl font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] font-magic tracking-wider">
                  {"Closet".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </h2>
                <motion.h2 
                  className="text-6xl sm:text-7xl font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] font-magic tracking-wider mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  {"Chronicle".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 1.5 + index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h2>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5, duration: 0.5 }}
              >
                <Link href="/createname" className="block">
                  <Button className="w-full sm:w-auto bg-[#f0c96b] hover:bg-[#e0b95b] text-green-900 drop-shadow-[0_0_5px_rgba(240,201,107,0.7)] font-medium py-4 px-8 rounded-lg border border-[#d8b85a] text-lg sm:text-xl transition-colors duration-200">
                    冒険の準備を始める
                  </Button>
                </Link>
              </motion.div>
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

