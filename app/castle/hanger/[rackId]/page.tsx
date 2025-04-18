"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Star, Lock, ChevronRight, Trophy, Shirt, Sparkles, Home, Wand2 } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { firebaseAuth } from "@/lib/firebase"

// ステップの型定義
interface Step {
  id: string
  title: string
  description: string
  isCompleted: boolean
  reward?: number // 報酬ポイント
}

// ハンガーラックの型定義
interface HangerRack {
  id: string
  name: string
  image: string
  steps: Step[]
  progress: number // 進行度（%）
  organizationDirection?: string // 整理収納の方向性
}

interface Adventure {
  id: string;
  organizationDirection: string;
  stepNumber: number;
  dungeonName: string;
  createdAt: any;
  isCompleted: boolean;
  reward: number;
}

// 表示用の冒険ステップの型定義
interface DisplayAdventure {
  id: string;
  stepNumber: number;
  dungeonName: string;
  reward: number;
}

interface RackData {
  name: string;
  imageUrl: string;
  stepsGenerated: boolean;
  adventures: Adventure[];
  progress: number;
  currentStepIndex: number;
  organizationDirection?: string;
}

// レベルに応じた背景色のグラデーションを取得する関数
const getLevelGradient = (level: number, isCompleted: boolean, isCurrent: boolean, isLocked: boolean) => {
  if (isLocked) {
    return "from-slate-800/90 to-slate-900/90"
  }

  // 完了または解放済みのステージの色を設定
  switch (level) {
    case 1:
      return "from-violet-600/90 to-violet-500/90"
    case 2:
      return "from-indigo-600/90 to-indigo-500/90"
    case 3:
      return "from-blue-600/90 to-blue-500/90"
    case 4:
      return "from-cyan-600/90 to-cyan-500/90"
    case 5:
      return "from-teal-600/90 to-teal-500/90"
    case 6:
      return "from-emerald-600/90 to-emerald-500/90"
    case 7:
      return "from-green-600/90 to-green-500/90"
    case 8:
      return "from-teal-500/90 to-teal-600/90"
    case 9:
      return "from-cyan-500/90 to-cyan-600/90"
    case 10:
      return "from-blue-500/90 to-blue-600/90"
    case 11:
      return "from-indigo-500/90 to-indigo-600/90"
    case 12:
      return "from-violet-500/90 to-violet-600/90"
    case 13:
      return "from-indigo-600/90 to-indigo-500/90"
    case 14:
      return "from-blue-600/90 to-blue-500/90"
    case 15:
      return "from-cyan-600/90 to-cyan-500/90"
    default:
      return "from-violet-500/90 to-violet-600/90"
  }
}

// レベルに応じたボーダー色を取得する関数
const getLevelBorder = (level: number, isCompleted: boolean, isCurrent: boolean, isLocked: boolean) => {
  if (isLocked) {
    return "border-slate-700/50"
  }

  // 完了または解放済みのステージの色を設定
  switch (level) {
    case 1:
      return "border-violet-400/50"
    case 2:
      return "border-indigo-400/50"
    case 3:
      return "border-blue-400/50"
    case 4:
      return "border-cyan-400/50"
    case 5:
      return "border-teal-400/50"
    case 6:
      return "border-emerald-400/50"
    case 7:
      return "border-green-400/50"
    case 8:
      return "border-teal-300/50"
    case 9:
      return "border-cyan-300/50"
    case 10:
      return "border-blue-300/50"
    case 11:
      return "border-indigo-300/50"
    case 12:
      return "border-violet-300/50"
    case 13:
      return "border-indigo-400/50"
    case 14:
      return "border-blue-400/50"
    case 15:
      return "border-cyan-400/50"
    default:
      return "border-violet-300/50"
  }
}

// レベルに応じたレベル表示の背景色を取得する関数
const getLevelBadgeColor = (level: number, isCompleted: boolean, isCurrent: boolean, isLocked: boolean) => {
  if (isLocked) {
    return "bg-slate-700"
  }

  // 完了または解放済みのステージの色を設定
  switch (level) {
    case 1:
      return "bg-violet-500"
    case 2:
      return "bg-indigo-500"
    case 3:
      return "bg-blue-500"
    case 4:
      return "bg-cyan-500"
    case 5:
      return "bg-teal-500"
    case 6:
      return "bg-emerald-500"
    case 7:
      return "bg-green-500"
    case 8:
      return "bg-teal-400"
    case 9:
      return "bg-cyan-400"
    case 10:
      return "bg-blue-400"
    case 11:
      return "bg-indigo-400"
    case 12:
      return "bg-violet-400"
    case 13:
      return "bg-indigo-500"
    case 14:
      return "bg-blue-500"
    case 15:
      return "bg-cyan-500"
    default:
      return "bg-violet-400"
  }
}

// ゴール解放状態を判定する関数を追加
const isGoalUnlocked = async (stepStatus: { [key: number]: boolean }, totalSteps: number, rackId: string): Promise<boolean> => {
  // 全てのステージが完了しているかチェック
  for (let i = 1; i <= totalSteps; i++) {
    if (!stepStatus[i]) {
      return false
    }
  }

  // 記憶の石碑のステータスを確認
  try {
    const response = await fetch(`/api/getUserData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keys: [`rack_${rackId}_memory_status`]
      }),
    })

    const data = await response.json()
    if (response.ok && data.data) {
      const memoryStatus = data.data[`rack_${rackId}_memory_status`]
      return memoryStatus === true || memoryStatus === "true"
    }
  } catch (error) {
    console.error("Error checking memory status:", error)
  }

  return false
}

export default function HangerDungeonPage() {
  const params = useParams()
  const router = useRouter()
  const rackId = params?.rackId as string
  if (!rackId) {
    router.push('/castle/hanger')
    return null
  }

  const { currentUser } = useAuth()
  const [rackData, setRackData] = useState<RackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [stepStatus, setStepStatus] = useState<{ [key: number]: boolean }>({})
  const [isLoadingSteps, setIsLoadingSteps] = useState(true)
  const [processedAdventures, setProcessedAdventures] = useState<DisplayAdventure[]>([])
  const [isGoalAvailable, setIsGoalAvailable] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const fetchStepStatus = async () => {
      if (processedAdventures.length === 0 || !rackId) {
        setIsLoadingSteps(false);
        setStepStatus({});
        return;
      }

      console.log('fetchStepStatus: Starting fetch for rackId:', rackId);
      setIsLoadingSteps(true);
      setError(null);

      try {
        const keys = Array.from({ length: processedAdventures.length }, (_, i) =>
          `rack_${rackId}_stage_${processedAdventures[i].stepNumber}_status`
        );
        console.log("Fetching status for keys:", keys);

        const response = await fetch(`/api/getUserData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keys: keys
          }),
        });

        const data = await response.json();
        console.log("Received step status data:", data);

        let finalStatus: { [key: number]: boolean } = {};

        if (response.ok && data.data) {
          const fetchedStatus: { [key: number]: boolean } = {};
          Object.entries(data.data).forEach(([key, value]) => {
            const match = key.match(/stage_(\d+)_status/);
            if (match && match[1]) {
              const stepNum = parseInt(match[1]);
              fetchedStatus[stepNum] = value === true || value === "true";
            }
          });

          processedAdventures.forEach((adv, index) => {
            const currentStepNum = adv.stepNumber;
            if (index === 0) {
              finalStatus[currentStepNum] = fetchedStatus[currentStepNum] || false;
            } else {
              const prevStepNum = processedAdventures[index - 1].stepNumber;
              if (finalStatus[prevStepNum] === true) {
                finalStatus[currentStepNum] = fetchedStatus[currentStepNum] || false;
              }
            }
          });
        } else {
          if(processedAdventures.length > 0) {
            finalStatus[processedAdventures[0].stepNumber] = false;
          }
          console.log("No step status data found or fetch failed, setting initial status.");
        }

        console.log("Setting step status:", finalStatus);
        setStepStatus(finalStatus);

        setIsGoalAvailable(await isGoalUnlocked(finalStatus, processedAdventures.length, rackId));

      } catch (error) {
        console.error("Error fetching step status:", error);
        setStepStatus({});
        setIsGoalAvailable(false);
      } finally {
        console.log('fetchStepStatus: Fetch process finished. Setting isLoadingSteps to false.');
        setIsLoadingSteps(false);
      }
    };

    fetchStepStatus();
  }, [processedAdventures, rackId]);

  useEffect(() => {
    const fetchRackData = async () => {
      if (!currentUser || !rackId) return;
      console.log('fetchRackData: Starting fetch for rackId:', rackId);
      setLoading(true);
      setError(null);
      setProcessedAdventures([]);

      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(`/api/racks/${rackId}/get`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            'Cache-Control': 'no-store'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('fetchRackData: API request failed:', response.status, errorText);
          throw new Error(`ハンガーラックのデータ取得に失敗しました (${response.status})`);
        }

        const data = await response.json();
        console.log('fetchRackData: Received data:', data);

        router.refresh();
        console.log('Data fetched, refreshing server data...');

        if (data) {
          setRackData(data);

          if (data.adventures && data.adventures.length > 0 && data.adventures[0].content) {
            try {
              console.log('Parsing adventures content...');
              const contentData = JSON.parse(data.adventures[0].content);
              if (contentData.steps && Array.isArray(contentData.steps)) {
                const adventuresToDisplay: DisplayAdventure[] = contentData.steps.map((step: any, index: number) => ({
                  id: `${data.adventures[0].id}-step-${step.stepNumber || index + 1}`,
                  stepNumber: step.stepNumber || index + 1,
                  dungeonName: step.dungeonName || `ステップ ${step.stepNumber || index + 1}`,
                  reward: step.reward || 100,
                }));
                console.log('fetchRackData: Processed adventures:', adventuresToDisplay);
                setProcessedAdventures(adventuresToDisplay);
              } else {
                console.warn('Parsed content does not contain valid steps array.');
                setProcessedAdventures([]);
              }
            } catch (parseError) {
              console.error("Error parsing adventures content:", parseError);
              setError("冒険データの解析に失敗しました。");
              setProcessedAdventures([]);
            }
          } else {
            console.log('No adventures content found or adventures array is empty.');
            setProcessedAdventures([]);
          }
        } else {
          throw new Error('受信したデータが無効です');
        }
      } catch (error) {
        console.error('fetchRackData: Error during fetch:', error);
        setError(error instanceof Error ? error.message : 'データの取得に失敗しました');
      } finally {
        console.log('fetchRackData: Fetch process finished. Setting loading to false.');
        setLoading(false);
      }
    };
    fetchRackData();
  }, [rackId, currentUser]);

  // ステップステータスが更新されたときに進行度を計算
  useEffect(() => {
    if (rackData?.adventures) {
      const completedSteps = Object.values(stepStatus).filter(status => status === true).length;
      const totalSteps = rackData.adventures.length;
      const calculatedProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      setProgress(calculatedProgress);
    }
  }, [stepStatus, rackData?.adventures]);

  const handleStepClick = (stepNumber: number) => {
    // ステップが開放されているかチェック
    if (stepStatus[stepNumber] === undefined) {
      alert("前のステップを完了させてください")
      return
    }

    router.push(`/castle/hanger/${rackId}/step-${stepNumber}`)
  }

  if (loading || isLoadingSteps) {
    return (
      <div className="min-h-screen w-full bg-[url('/castle.png')] bg-cover bg-center text-amber-300 flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-violet-800/60">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="text-2xl font-bold"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            移動中...
          </motion.div>
          <motion.div
            className="flex gap-2"
            animate={{
              x: [0, 20, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-4xl">👣</span>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error || !rackData) {
    return (
      <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-violet-800/60">
        <p className="text-red-400">{error || "データの取得に失敗しました"}</p>
        <Button
          onClick={() => router.push("/home")}
          className="mt-4 bg-amber-600 hover:bg-amber-700"
        >
          ホームに戻る
        </Button>
      </div>
    )
  }

  const latestAdventure = rackData.adventures?.[0]

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-violet-800/60">
      {/* Magical floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-500/20 blur-sm"
            style={{
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        ))}
      </div>

      {/* Light effects */}
      <div className="absolute left-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"></div>
      <div
        className="absolute right-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="w-full max-w-5xl z-10 mt-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/castle/hanger"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>ハンガーラック一覧に戻る</span>
          </Link>

          <Link
            href="/castle"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            <span>クローゼット城に戻る</span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shirt className="h-6 w-6 text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400 tracking-wider">{rackData.name}</h1>
          </div>

          <div className="flex justify-between items-center">
            <div>

              <p className="text-lg text-amber-300/80">整理収納の冒険を進めましょう！</p>
              <p className="text-sm text-amber-300/60">※冒険ストーリーが生成されていない場合は、ページをリロードしてみてね</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-medium">進行度:</span>
              <div className="w-32 h-3 bg-blue-900/50 rounded-full overflow-hidden border border-amber-500/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", bounce: 0.2, duration: 1 }}
                />
              </div>
              <span className="text-amber-300 font-medium">{progress}%</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* 写真と整理収納の方向性のカード */}
          <Card className="relative overflow-hidden bg-gradient-to-b from-violet-800/90 to-violet-900/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 写真 */}
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={rackData.imageUrl}
                  alt={rackData.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-contain bg-black/20"
                />
              </div>

              {/* 整理収納の方向性 */}
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  モーちゃんからのアドバイス
                </h3>
                <div className="relative">
                  <div className="bg-blue-900/50 rounded-lg p-4 border border-amber-500/30 relative">
                    <div className="absolute -bottom-4 -left-4 w-16 h-16">
                      <Image
                        src="/cow-fairy.webp"
                        alt="モーちゃん"
                        width={64}
                        height={64}
                        className="rounded-full border-2 border-amber-500/50"
                      />
                    </div>
                    <div className="text-amber-300/80 pl-16">
                      {rackData.stepsGenerated ? (
                        <div className="flex items-center">
                          <span>
                            {latestAdventure?.organizationDirection || "モーちゃんが分析中..."}
                          </span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="ml-2"
                          >
                            <Sparkles className="h-4 w-4 text-amber-400" />
                          </motion.div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>
                            モーちゃんが分析中...
                          </span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="ml-2"
                          >
                            <Sparkles className="h-4 w-4 text-amber-400" />
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 整理収納ダンジョンカード */}
          <Card className="relative overflow-hidden bg-gradient-to-b from-violet-800/90 to-violet-900/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

            <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              あなただけの冒険ストーリー
            </h2>

            {/* ダンジョンカードのグリッド */}
            <div className="grid grid-cols-1 gap-4">
              {processedAdventures.map((adventure) => {
                const isCompleted = stepStatus[adventure.stepNumber] === true;
                const firstIncompleteStepNum = processedAdventures
                  .map(adv => adv.stepNumber)
                  .sort((a, b) => a - b)
                  .find(num => stepStatus[num] === false);
                const isCurrent = firstIncompleteStepNum !== undefined && adventure.stepNumber === firstIncompleteStepNum && !isCompleted;
                const isLocked = stepStatus[adventure.stepNumber] === undefined;
                const level = adventure.stepNumber;

                const bgGradient = getLevelGradient(level, isCompleted, isCurrent, isLocked);
                const borderColor = getLevelBorder(level, isCompleted, isCurrent, isLocked);
                const badgeColor = getLevelBadgeColor(level, isCompleted, isCurrent, isLocked);

                return (
                  <motion.div
                    key={adventure.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: adventure.stepNumber * 0.1 }}
                    whileHover={!isLocked ? { y: -5 } : {}}
                    onClick={() => handleStepClick(adventure.stepNumber)}
                    className={`cursor-pointer ${isLocked ? "cursor-not-allowed" : ""}`}
                  >
                    <Card
                      className={`relative overflow-hidden bg-gradient-to-b ${bgGradient} border-2 ${borderColor} h-[100px] flex flex-row transition-all duration-300 ${
                        isLocked ? "opacity-70" : "shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                      }`}
                    >
                      {/* Decorative corners */}
                      <div
                        className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${isLocked ? "border-slate-600" : "border-amber-500"}`}
                      ></div>
                      <div
                        className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${isLocked ? "border-slate-600" : "border-amber-500"}`}
                      ></div>
                      <div
                        className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${isLocked ? "border-slate-600" : "border-amber-500"}`}
                      ></div>
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${isLocked ? "border-slate-600" : "border-amber-500"}`}
                      ></div>

                      {/* レベル表示（左側） */}
                      <div
                        className={`flex items-center justify-center ${badgeColor} w-[80px] h-full border-r-2 ${borderColor}`}
                      >
                        <div className="text-center">
                          <div className="text-xs text-white/80 font-medium mb-1">STAGE</div>
                          <div className="text-3xl font-bold text-white">{level}</div>
                        </div>
                      </div>

                      {/* メインコンテンツ */}
                      <div className="p-3 flex-1 flex flex-col justify-center relative">
                        <div className="flex items-center">
                          <h3
                            className={`text-xl font-bold ${
                              isCompleted ? "text-amber-400" : isCurrent ? "text-amber-300" : "text-slate-400"
                            }`}
                          >
                            {adventure.dungeonName}
                          </h3>
                        </div>

                        <div className="flex items-center mt-2">
                          <div
                            className={`flex items-center gap-1 ${
                              isCompleted ? "text-amber-400" : "text-amber-300/60"
                            }`}
                          >
                            <Star className="h-4 w-4" />
                            <span className="text-sm font-medium">{adventure.reward} pts</span>
                          </div>
                        </div>

                        {/* ステータスアイコン（右側） */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isCompleted ? (
                            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                              >
                                <CheckCircle2 className="h-10 w-10 text-green-400" />
                              </motion.div>
                            </div>
                          ) : !isLocked ? (
                            <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                              >
                                <ChevronRight className="h-10 w-10 text-amber-400" />
                              </motion.div>
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                              <Lock className="h-8 w-8 text-slate-500" />
                            </div>
                          )}
                        </div>

                        {/* 光るエフェクト（現在のステップ） */}
                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 z-0"
                            animate={{
                              boxShadow: [
                                "inset 0 0 5px 2px rgba(251,191,36,0.1)",
                                "inset 0 0 15px 5px rgba(251,191,36,0.2)",
                                "inset 0 0 5px 2px rgba(251,191,36,0.1)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          />
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}

              {/* 記憶の石碑カード */}
              {processedAdventures.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: processedAdventures.length * 0.1 }}
                  whileHover={stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] === true ? { y: -5 } : {}}
                  className={stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] === true ? "cursor-pointer" : "cursor-not-allowed"}
                  onClick={() => {
                    if (stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] === true) {
                      router.push(`/castle/hanger/${rackId}/memory`)
                    }
                  }}
                >
                  <Card
                    className={`relative overflow-hidden ${
                      stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] === true
                        ? "bg-gradient-to-br from-[#800020]/90 via-[#4B0082]/90 to-[#800020]/90 border-2 border-amber-300/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                        : "bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-slate-700/50"
                    } h-[100px] flex flex-row transition-all duration-300`}
                  >
                    {/* Decorative corners */}
                    <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
                      stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] ? "border-amber-300" : "border-slate-600"
                    }`}></div>
                    <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${
                      stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] ? "border-amber-300" : "border-slate-600"
                    }`}></div>
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${
                      stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] ? "border-amber-300" : "border-slate-600"
                    }`}></div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
                      stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] ? "border-amber-300" : "border-slate-600"
                    }`}></div>

                    {/* 石碑表示（左側） */}
                    <div className={`flex items-center justify-center ${
                      stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber]
                        ? "bg-gradient-to-br from-[#800020] to-[#4B0082]"
                        : "bg-slate-700"
                    } w-[80px] h-full border-r-2 ${
                      stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] ? "border-amber-300/50" : "border-slate-600/50"
                    }`}>
                      <div className="text-center">
                        <div className="text-xs text-white/80 font-medium mb-1">MEMORY</div>
                        <Wand2 className={`h-8 w-8 ${
                          stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] ? "text-white" : "text-slate-400"
                        } mx-auto`} />
                      </div>
                    </div>

                    {/* メインコンテンツ */}
                    <div className="p-3 flex-1 flex flex-col justify-center relative">
                      <div className="flex items-center">
                        <h3 className={`text-xl font-bold ${
                          stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] ? "text-amber-400" : "text-slate-400"
                        }`}>
                          記憶の石碑
                        </h3>
                      </div>

                      <div className={`text-sm mt-2 ${
                        stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] ? "text-amber-300/90" : "text-slate-400/90"
                      }`}>
                        {stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] 
                          ? "あなたの冒険の記録を残しましょう"
                          : "最後のステージをクリアすると解放されます"}
                      </div>

                      {/* ステータスアイコン（右側） */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] ? (
                          <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Wand2 className="h-10 w-10 text-amber-400" />
                            </motion.div>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-slate-500" />
                          </div>
                        )}
                      </div>

                      {/* 光るエフェクト */}
                      {stepStatus[processedAdventures[processedAdventures.length - 1].stepNumber] && (
                        <motion.div
                          className="absolute inset-0 z-0"
                          animate={{
                            boxShadow: [
                              "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                              "inset 0 0 20px 10px rgba(251,191,36,0.2)",
                              "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ゴール地点 */}
              {processedAdventures.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: processedAdventures.length * 0.1 }}
                  whileHover={isGoalAvailable ? { y: -5 } : {}}
                  className={isGoalAvailable ? "cursor-pointer" : "cursor-not-allowed"}
                  onClick={async () => {
                    if (isGoalAvailable) {
                      try {
                        const response = await fetch("/api/updateUserData", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            key: `rack_${rackId}_status`,
                            value: true
                          }),
                        });

                        if (!response.ok) {
                          const error = await response.json()
                          throw new Error(error.error || "データの更新に失敗しました")
                        }

                        router.push(`/castle/hanger/${rackId}/clear`)
                      } catch (error) {
                        console.error("Error updating rack status:", error)
                        alert(error instanceof Error ? error.message : "エラーが発生しました")
                      }
                    }
                  }}
                >
                  <Card
                    className={`relative overflow-hidden bg-gradient-to-br ${
                      isGoalAvailable
                        ? "from-[#005F5F]/90 via-[#000080]/90 to-[#005F5F]/90 border-2 border-amber-300/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                        : "from-slate-700/90 to-slate-800/90 border-2 border-slate-600/50 opacity-70"
                    } h-[100px] flex flex-row transition-all duration-300`}
                  >
                    {/* Decorative corners */}
                    <div
                      className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
                        isGoalAvailable ? "border-amber-300" : "border-slate-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${
                        isGoalAvailable ? "border-amber-300" : "border-slate-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${
                        isGoalAvailable ? "border-amber-300" : "border-slate-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
                        isGoalAvailable ? "border-amber-300" : "border-slate-600"
                      }`}
                    ></div>

                    {/* ゴール表示（左側） */}
                    <div
                      className={`flex items-center justify-center ${
                        isGoalAvailable ? "bg-gradient-to-br from-[#005F5F] to-[#000080]" : "bg-slate-700"
                      } w-[80px] h-full border-r-2 ${
                        isGoalAvailable ? "border-amber-300/50" : "border-slate-600/50"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xs text-white/80 font-medium mb-1">GOAL</div>
                        <Trophy
                          className={`h-8 w-8 ${
                            isGoalAvailable ? "text-white" : "text-slate-400"
                          } mx-auto`}
                        />
                      </div>
                    </div>

                    {/* メインコンテンツ */}
                    <div className="p-3 flex-1 flex flex-col justify-center relative">
                      <div className="flex items-center">
                        <h3
                          className={`text-xl font-bold ${
                            isGoalAvailable ? "text-amber-400" : "text-slate-400"
                          }`}
                        >
                          最終章📖終わりなきクロニクル
                        </h3>
                      </div>

                      <div className={`text-sm mt-2 ${isGoalAvailable ? "text-amber-300/90" : "text-amber-300/90"}`}>
                        特別な報酬を獲得できます
                      </div>

                      {/* ステータスアイコン（右側） */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isGoalAvailable ? (
                          <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Trophy className="h-10 w-10 text-amber-400" />
                            </motion.div>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-slate-700/30 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-slate-500" />
                          </div>
                        )}
                      </div>

                      {/* 光るエフェクト（クリア時） */}
                      {isGoalAvailable && (
                        <motion.div
                          className="absolute inset-0 z-0"
                          animate={{
                            boxShadow: [
                              "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                              "inset 0 0 20px 10px rgba(251,191,36,0.2)",
                              "inset 0 0 10px 5px rgba(251,191,36,0.1)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

