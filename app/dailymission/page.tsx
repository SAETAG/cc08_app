"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scroll, ArrowLeft, Sparkles, Swords, Flame, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

// Mission type definition
type Mission = {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  exp: number
  emoji: string
  details: string
  actions: string[]
  timeEstimate: string
  completed: boolean
}

export default function DailyMissionPage() {
  // Sample mission data
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "mission1",
      title: "布の亡霊を封印せよ！",
      description: "床に落ちた服を1枚拾い、定位置に戻して秩序を取り戻す。",
      difficulty: "easy",
      exp: 50,
      emoji: "👕",
      details: "床に落ちた服を1枚拾い、定位置に戻して秩序を取り戻そう。",
      actions: ["床に落ちている服を1枚発見する", "洗濯かご or クローゼットを選ぶ", "所定の位置に戻す"],
      timeEstimate: "1分",
      completed: false,
    },
    {
      id: "mission2",
      title: "彷徨える孤独な靴下を救出せよ！",
      description: "ペアとはぐれてしまった靴下を三つ見つけて、片割れを探そう。",
      difficulty: "medium",
      exp: 80,
      emoji: "🧦",
      details: "バラバラになった靴下を整理して、使いやすくしましょう。",
      actions: [
        "ペアがない靴下を三つ見つけ出す",
        "片割れを探してペアにする",
        "ペアがない靴下や古い靴下は処分する",
      ],
      timeEstimate: "3分",
      completed: false,
    },
    {
      id: "mission3",
      title: "かつての盟友に、別れの言葉を…！",
      description: "かつてはよく着ていたけれど、この一年着ていない一枚に別れを告げよう",
      difficulty: "hard",
      exp: 120,
      emoji: "🧹",
      details: "かつてはよく着ていたけれど、この一年着ていない服一着に、別れを告げよう。",
      actions: [
        "クローゼットを見渡し、この一年着ていない服を一枚取り出す",
        "その服との想い出を3分、振り返ってお礼を言う",
        "その服をフリマに出すか、処分する",
      ],
      timeEstimate: "5分",
      completed: false,
    },
  ])

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)

  // Handle mission completion
  const completeMission = (id: string) => {
    setMissions(missions.map((mission) => (mission.id === id ? { ...mission, completed: true } : mission)))
  }

  // Difficulty stars mapping
  const difficultyStars = {
    easy: "★☆☆",
    medium: "★★☆",
    hard: "★★★",
  }

  // Difficulty star colors
  const difficultyStarColors = {
    easy: "text-cyan-300",
    medium: "text-teal-300",
    hard: "text-amber-300",
  }

  // Difficulty card styling
  const difficultyCardStyle = {
    easy: {
      bg: "bg-gradient-to-b from-cyan-900/70 via-blue-900/70 to-blue-950/70",
      border: "border-cyan-500/30",
      shadow: "shadow-md",
      icon: "text-cyan-400",
      detailsBg: "bg-cyan-900/40",
      detailsBorder: "border-cyan-500/30",
      detailsText: "text-cyan-200",
      cardBg: "bg-blue-900/70",
      cardBorder: "border-cyan-500/50",
      checkboxBg: "bg-blue-800/80",
      checkboxBorder: "border-cyan-500/50",
      checkboxCheckedBg: "bg-cyan-700/80",
    },
    medium: {
      bg: "bg-gradient-to-b from-teal-900/70 via-green-900/70 to-green-950/70",
      border: "border-teal-500/30",
      shadow: "shadow-md",
      icon: "text-teal-400",
      detailsBg: "bg-teal-900/40",
      detailsBorder: "border-teal-500/30",
      detailsText: "text-teal-300",
      cardBg: "bg-green-900/70",
      cardBorder: "border-teal-500/50",
      checkboxBg: "bg-green-800/80",
      checkboxBorder: "border-teal-500/50",
      checkboxCheckedBg: "bg-teal-700/80",
    },
    hard: {
      bg: "bg-gradient-to-b from-amber-800/70 via-orange-900/70 to-orange-950/70",
      border: "border-amber-500/30",
      shadow: "shadow-md",
      icon: "text-amber-400",
      detailsBg: "bg-amber-900/40",
      detailsBorder: "border-amber-500/30",
      detailsText: "text-amber-200",
      cardBg: "bg-amber-900/70",
      cardBorder: "border-amber-500/50",
      checkboxBg: "bg-amber-800/80",
      checkboxBorder: "border-amber-500/50",
      checkboxCheckedBg: "bg-amber-700/80",
    },
  }

  return (
    <div className="min-h-screen w-full bg-purple-900 text-amber-300 flex flex-col">
      {/* Back button in top-right corner */}
      <div className="absolute top-4 right-4 z-20">
        <Link href="/home">
          <Button
            variant="outline"
            size="sm"
            className="bg-purple-900/90 border-yellow-600/50 text-amber-300 hover:bg-purple-800/90 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>戻る</span>
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 pt-16 relative bg-[url('/dailymission.png')] bg-cover bg-center bg-no-repeat bg-fixed">
        {/* Green Overlay */}
        <div className="absolute inset-0 bg-green-900/20 backdrop-blur-sm"></div>
        {/* Large Gold Title */}
        <div className="text-center mb-10 relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-500 font-['MedievalSharp']">Daily Mission</h1>
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-500/80 to-transparent mx-auto mt-3"></div>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission List */}
          <div className="md:col-span-1 flex flex-col">
            <Card className="border-2 border-yellow-500/50 overflow-hidden bg-purple-900/70 backdrop-blur-sm flex-1">
              <CardHeader className="border-b border-yellow-500/40 p-4 bg-purple-900/70 backdrop-blur-sm">
                <CardTitle className="text-amber-300 text-xl">
                  <div className="flex items-center gap-2">
                    <Swords className="h-5 w-5 text-amber-300" />
                    ミッションリスト
                  </div>
                </CardTitle>
                <CardDescription className="text-amber-200/90">今日の片付けミッションを選択しよう</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    className={cn(
                      "relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                      difficultyCardStyle[mission.difficulty].shadow,
                      selectedMission?.id === mission.id ? "ring-4 ring-yellow-500/50" : "",
                      mission.completed ? "opacity-70" : "",
                    )}
                    onClick={() => setSelectedMission(mission)}
                  >
                    {/* Card background with border */}
                    <div
                      className={cn(
                        "absolute inset-0",
                        difficultyCardStyle[mission.difficulty].bg,
                        "border",
                        difficultyCardStyle[mission.difficulty].border,
                      )}
                    ></div>

                    {/* Content */}
                    <div className="relative p-3">
                      <h3
                        className={cn(
                          "font-bold text-amber-300 mb-1",
                          mission.completed ? "line-through opacity-70" : "",
                        )}
                      >
                        {mission.title} {mission.emoji}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className={cn("flex items-center gap-1", difficultyStarColors[mission.difficulty])}>
                          <span className="text-xs text-white/90">難易度</span>
                          <span className="text-lg font-bold">{difficultyStars[mission.difficulty]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-300">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-medium">{mission.timeEstimate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Completed overlay */}
                    {mission.completed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                        <Badge className="bg-green-700 text-white px-3 py-1 text-sm border border-emerald-400/30">
                          クリア済み
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Mission Details */}
          <div className="md:col-span-2 flex flex-col">
            {selectedMission ? (
              <Card
                className={cn(
                  "border-2 flex-1 backdrop-blur-sm",
                  difficultyCardStyle[selectedMission.difficulty].cardBg,
                  difficultyCardStyle[selectedMission.difficulty].cardBorder,
                )}
              >
                <CardHeader
                  className={cn(
                    "border-b p-2 relative backdrop-blur-sm",
                    difficultyCardStyle[selectedMission.difficulty].bg,
                    "border-b-" + difficultyCardStyle[selectedMission.difficulty].cardBorder,
                  )}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <div className="flex flex-col gap-0.5">
                        <CardTitle className="text-amber-300 text-lg">
                          <div className="flex items-center gap-2">
                            <Flame className={cn("h-4 w-4", difficultyCardStyle[selectedMission.difficulty].icon)} />
                            {selectedMission.title} {selectedMission.emoji}
                          </div>
                        </CardTitle>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn("flex items-center gap-1", difficultyStarColors[selectedMission.difficulty])}
                          >
                            <span className="text-xs text-white/90">難易度</span>
                            <span className="text-lg font-bold">{difficultyStars[selectedMission.difficulty]}</span>
                          </div>
                          <div className="flex items-center gap-1 text-cyan-300">
                            <span className="text-xs text-white/90">報酬</span>
                            <span className="text-lg font-bold flex items-center">
                              <Sparkles className="h-4 w-4 mr-1 text-cyan-300" />
                              {selectedMission.exp}EXP
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-purple-300">
                            <span className="text-xs text-white/90">目安時間</span>
                            <span className="text-lg font-bold flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-purple-300" />
                              {selectedMission.timeEstimate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4 relative">
                  {/* Background Emoji */}
                  <div className="absolute right-4 bottom-4 text-[250px] opacity-25 transform -rotate-12 pointer-events-none select-none">
                    {selectedMission.emoji}
                  </div>

                  {/* Mission Details as Title */}
                  <div className="mb-2">
                    <h3
                      className={cn("text-lg font-bold", difficultyCardStyle[selectedMission.difficulty].detailsText)}
                    >
                      {selectedMission.details}
                    </h3>
                  </div>

                  {/* Actions Card */}
                  <div
                    className={cn(
                      "rounded-lg p-3 border relative z-10",
                      difficultyCardStyle[selectedMission.difficulty].detailsBg,
                      difficultyCardStyle[selectedMission.difficulty].detailsBorder,
                    )}
                  >
                    <ul className="space-y-2">
                      {selectedMission.actions.map((action, index) => (
                        <li key={index} className="flex items-center gap-2 group">
                          <div
                            className={cn(
                              "text-2xl flex items-center",
                              difficultyCardStyle[selectedMission.difficulty].detailsText,
                            )}
                          >
                            {selectedMission.emoji}
                          </div>
                          <span className="text-amber-200/90">
                            {action}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="p-3 border-t border-yellow-500/30 flex justify-end relative z-10">
                  <Button
                    className={cn(
                      "bg-amber-600 hover:bg-amber-500 text-white border border-amber-400/50",
                      selectedMission.completed && "opacity-50 cursor-not-allowed",
                    )}
                    disabled={selectedMission.completed}
                    onClick={() => completeMission(selectedMission.id)}
                  >
                    {selectedMission.completed ? "クリア済み" : "ミッションクリア！"}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="bg-purple-900/70 border-2 border-yellow-500/50 h-full relative z-10">
                <div className="flex flex-col items-center justify-center h-full p-8 text-center relative z-20">
                  <div className="w-20 h-20 rounded-full bg-purple-800 flex items-center justify-center mb-4 border border-indigo-400/50">
                    <Scroll className="h-10 w-10 text-amber-300" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-300 mb-2">ミッションを選択してください</h3>
                  <p className="text-amber-200/90 max-w-md">
                    左側のリストからミッションを選択すると、詳細が表示されます。
                    毎日のミッションをクリアして、片付けの勇者になりましょう！
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
