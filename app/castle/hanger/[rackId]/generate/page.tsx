"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Loader2, Sparkles, Wand2 } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'

// 生成メッセージの配列
const generationMessages = [
  "ダンジョン生成中...",
  "モーちゃんがあなただけのダンジョンを準備しています...",
  "整理収納の魔法を編み出しています...",
  "クローゼットの迷宮を構築中...",
  "あなたの冒険に最適なステップを計算中...",
  "魔法の整理術を具現化しています...",
  "収納の秘術を解き明かしています..."
]

export default function GenerateDungeonPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser } = useAuth()
  const rackId = params.rackId as string
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(true)
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isInitialMount, setIsInitialMount] = useState(true)  // 初回マウントフラグを追加

  // 初回マウント時のみ実行
  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  // OpenAI APIを呼び出してダンジョンを生成
  useEffect(() => {
    let isSubscribed = true;

    const generateDungeon = async () => {
      // 初回マウント時または既に生成済みの場合は処理をスキップ
      if (isInitialMount || !currentUser || !rackId || hasGenerated) {
        if (!currentUser) setError("ユーザーが認証されていません");
        if (!rackId) setError("ハンガーラックIDが指定されていません");
        return;
      }

      try {
        const token = await currentUser.getIdToken();
        console.log('Starting generation with token:', token ? 'exists' : 'missing');
        
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            mode: "hanger",
            prompt: "ハンガーラックの整理収納のための冒険ストーリーを生成してください",
            rackId: rackId
          })
        });

        if (!isSubscribed) return;
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI API error response:', errorText);
          if (errorText.includes("quota") || errorText.includes("429")) {
            throw new Error("OpenAIのAPIクォータを超過しました。管理者にお問い合わせください。");
          }
          throw new Error(`APIエラー: ${response.status} ${errorText}`);
        }

        // レスポンスのテキストを取得
        const responseText = await response.text();
        console.log('Raw OpenAI API response:', responseText);

        // JSONとしてパース
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('Parsed OpenAI API response:', data);

          // レスポンスの構造を検証
          if (!data.result) {
            throw new Error('OpenAI APIのレスポンスに"result"フィールドがありません');
          }

          // resultフィールドの中身を検証
          const parsedResult = JSON.parse(data.result);
          if (!parsedResult.organizationDirection || !Array.isArray(parsedResult.steps)) {
            throw new Error('OpenAI APIのレスポンスの形式が不正です');
          }

          console.log('Validated response structure:', parsedResult);
        } catch (parseError) {
          console.error('Error parsing OpenAI response:', parseError);
          throw new Error('OpenAI APIからの応答の解析に失敗しました');
        }
        
        if (!isSubscribed) return;
        
        // ハンガーラックのstepsGeneratedをtrueに更新
        try {
          console.log('Updating stepsGenerated to true for rackId:', rackId);
          
          const updateUrl = `/api/racks/${rackId}`;
          console.log('Making POST request to:', updateUrl);
          
          // リトライメカニズムの追加
          const maxRetries = 3;
          let retryCount = 0;
          let updateSuccess = false;

          while (retryCount < maxRetries && !updateSuccess) {
            try {
              const updateResponse = await fetch(updateUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  stepsGenerated: true
                })
              });

              console.log('Update response status:', updateResponse.status);
              const responseText = await updateResponse.text();
              console.log('Update response text:', responseText);

              if (!updateResponse.ok) {
                throw new Error(`ハンガーラックの更新に失敗しました: ${responseText}`);
              }

              // 更新が成功したことを確認
              const updateData = JSON.parse(responseText);
              if (updateData?.stepsGenerated === true) {
                updateSuccess = true;
                console.log('Update successful:', updateData);
              } else {
                throw new Error('更新後のステータスが期待通りではありません');
              }
            } catch (retryError) {
              console.error(`Retry ${retryCount + 1} failed:`, retryError);
              retryCount++;
              if (retryCount < maxRetries) {
                // 指数バックオフで待機
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
              }
            }
          }

          if (!updateSuccess) {
            throw new Error('最大リトライ回数を超えました');
          }
          
          // 全ての処理が成功した後にhasGeneratedをtrueに設定
          setHasGenerated(true);
          setProgress(100);
          
        } catch (updateError) {
          console.error('Error updating rack:', updateError);
          throw new Error('ハンガーラックの更新中にエラーが発生しました');
        }
        
      } catch (err) {
        if (!isSubscribed) return;
        console.error("Error in generation process:", err);
        setError(err instanceof Error ? err.message : "エラーが発生しました");
        setIsGenerating(false);
        // エラーが発生した場合はhasGeneratedをfalseに戻す
        setHasGenerated(false);
      }
    };

    generateDungeon();
    return () => {
      isSubscribed = false;
    };
  }, [currentUser, rackId, hasGenerated, isInitialMount]);  // isInitialMountを依存配列に追加

  // アニメーション関連のuseEffectをまとめる
  useEffect(() => {
    if (!isGenerating || progress >= 100) return;

    // メッセージ切り替え用のインターバル
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % generationMessages.length);
    }, 3000);

    // プログレスバー更新用のインターバル
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 800);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isGenerating, progress]);

  // 生成完了時の処理
  useEffect(() => {
    if (progress >= 100) {
      setIsGenerating(false);
      setShowCompletionMessage(true);
      
      const redirectTimer = setTimeout(() => {
        // データを再取得するために、クエリパラメータを追加
        router.push(`/castle/hanger/${rackId}?refresh=true`);
      }, 2000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [progress, rackId, router]);

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-violet-800/60">
        <div className="z-10 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">エラーが発生しました</h2>
          <p className="text-amber-300/80 mb-6">{error}</p>
          <button
            onClick={() => router.push(`/castle/hanger/${rackId}`)}
            className="bg-amber-500 hover:bg-amber-400 text-white py-2 px-4 rounded-md"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-violet-800/60">
      {/* Magical floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
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
      <div className="absolute left-1/4 top-1/4 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl animate-pulse"></div>
      <div
        className="absolute right-1/4 top-1/4 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute left-1/3 bottom-1/4 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <div className="z-10 flex flex-col items-center justify-center max-w-xl text-center">
        {/* モーちゃんの画像 */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500/50 relative">
            <Image
              src="/cow-fairy.webp"
              alt="モーちゃん"
              fill
              className="object-cover"
            />
          </div>
          <motion.div
            className="absolute -inset-2 rounded-full z-0"
            animate={{
              boxShadow: [
                "0 0 10px 5px rgba(251,191,36,0.2)",
                "0 0 20px 10px rgba(251,191,36,0.3)",
                "0 0 10px 5px rgba(251,191,36,0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Sparkles className="h-4 w-4 text-blue-950" />
          </motion.div>
        </div>

        {/* 魔法陣アニメーション */}
        <div className="relative mb-8">
          {/* 外側の魔法陣 */}
          <motion.div
            className="absolute w-64 h-64 border-4 border-amber-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          
          {/* 中間の魔法陣 */}
          <motion.div
            className="absolute w-52 h-52 border-2 border-amber-400/40 rounded-full"
            style={{ left: "calc(50% - 104px)", top: "calc(50% - 104px)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            {/* 魔法陣の記号 */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-amber-400/80"
                style={{
                  left: "calc(50% - 6px)",
                  top: "-6px",
                  transform: `rotate(${i * 45}deg) translateY(-104px)`,
                }}
              />
            ))}
          </motion.div>
          
          {/* 内側の魔法陣 */}
          <motion.div
            className="absolute w-40 h-40 border-2 border-purple-400/40 rounded-full"
            style={{ left: "calc(50% - 80px)", top: "calc(50% - 80px)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            {/* 内側の魔法陣の記号 */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-400/80"
                style={{
                  left: "calc(50% - 4px)",
                  top: "-4px",
                  transform: `rotate(${i * 60}deg) translateY(-80px)`,
                }}
              />
            ))}
          </motion.div>
          
          {/* 中央のアイコン */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {isGenerating ? (
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }}
              >
                <Wand2 className="w-12 h-12 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <Sparkles className="w-12 h-12 text-amber-400" />
              </motion.div>
            )}
          </div>
        </div>

        {/* 進行状況メッセージ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mb-8 min-h-16"
          >
            {showCompletionMessage ? (
              <h2 className="text-2xl font-bold text-amber-400">
                ダンジョン生成完了！冒険に出発します...
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-amber-400">
                {generationMessages[currentMessageIndex]}
              </h2>
            )}
          </motion.div>
        </AnimatePresence>

        {/* プログレスバー */}
        <div className="w-full max-w-md h-3 bg-blue-900/50 rounded-full overflow-hidden mb-4 border border-amber-500/30">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0.2 }}
          />
        </div>
        
        <p className="text-amber-300/80 text-sm">
          {Math.round(progress)}% 完了
        </p>
      </div>

      {/* 魔法の光線エフェクト */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-0.5 bg-gradient-to-t from-amber-500/0 via-amber-400/30 to-amber-500/0"
            style={{
              height: "100vh",
              transformOrigin: "bottom center",
              transform: `rotate(${i * 45}deg)`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </div>
  )
}

