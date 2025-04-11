"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardMedia, Typography, Grid, Container, Box } from '@mui/material'
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, PlayCircle, Shirt, Plus, Home, Sparkles } from "lucide-react"
import { useAuth } from '@/app/contexts/AuthContext'

interface Rack {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  ownerId: string;
  stepsGenerated: boolean;
}

interface AdventureCreatedAt {
  _seconds: number;
  _nanoseconds: number;
}

export default function HangerList() {
  const { currentUser, loading: authLoading } = useAuth()
  const [racks, setRacks] = useState<Rack[]>([])
  const [adventureDates, setAdventureDates] = useState<{[key: string]: AdventureCreatedAt | null}>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    console.log('Auth state:', { currentUser, authLoading });
  }, [currentUser, authLoading]);

  useEffect(() => {
    const fetchRacks = async () => {
      if (!currentUser) {
        console.log('No user found');
        return;
      }

      try {
        console.log('Fetching racks for user:', currentUser.uid);
        const token = await currentUser.getIdToken();
        console.log('Got token:', token.substring(0, 10) + '...');
        
        const response = await fetch('/api/racks/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.error('API error:', response.status, response.statusText);
          const errorData = await response.json();
          console.error('Error details:', errorData);
          throw new Error('ハンガーラックの取得に失敗しました');
        }

        const data = await response.json();
        console.log('Received racks:', data.racks);
        setRacks(data.racks);

        // 各ラックのアドベンチャー作成日を取得
        const dates: {[key: string]: AdventureCreatedAt | null} = {};
        for (const rack of data.racks) {
          console.log('Fetching adventure for rack:', rack.id);
          const adventureResponse = await fetch(`/api/adventures/${rack.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Adventure response status:', adventureResponse.status);
          if (adventureResponse.ok) {
            const adventureData = await adventureResponse.json();
            console.log('Adventure data for rack:', rack.id, adventureData);
            dates[rack.id] = adventureData.createdAt;
          } else {
            console.error('Failed to fetch adventure data:', await adventureResponse.text());
          }
        }
        console.log('All adventure dates:', dates);
        setAdventureDates(dates);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRacks();
  }, [currentUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex items-center justify-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
        <p className="text-center z-10">認証情報を読み込み中...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center justify-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
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
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex items-center justify-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
        <p className="text-center text-red-500 z-10">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex flex-col items-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
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
            href="/castle"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>クローゼット城に戻る</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {racks.map((rack, index) => (
            <motion.div
              key={rack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] h-[280px] flex flex-col">
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={rack.imageUrl}
                    alt={rack.name}
                    fill
                    priority={index === 0}
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent" />
                </div>

                <div className="p-4 relative flex-1 flex flex-col">
                  <div className="flex items-center mb-2">
                    <Shirt className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-amber-400 truncate">{rack.name}</h3>
                  </div>
                  <div className="text-sm text-amber-300/80 mb-3">
                    {adventureDates[rack.id] ? (
                      <span>冒険ストーリー作成日: {
                        new Date(adventureDates[rack.id]!._seconds * 1000).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })
                      }</span>
                    ) : (
                      <span>冒険ストーリーはまだ作成されていません</span>
                    )}
                  </div>

                  <div className="flex justify-center mt-6">
                    {rack.stepsGenerated ? (
                      <Link
                        href={`/castle/hanger/${rack.id}`}
                        className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-base font-medium py-2 px-6 rounded-lg shadow-lg border border-purple-400/30 relative overflow-hidden group flex items-center gap-2"
                      >
                        <Sparkles className="h-5 w-5" />
                        <span className="relative z-10">冒険を再開する</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/castle/hanger/${rack.id}/generate`}
                        className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-base font-medium py-2 px-6 rounded-lg shadow-lg border border-amber-400/30 relative overflow-hidden group flex items-center gap-2"
                      >
                        <Sparkles className="h-5 w-5" />
                        <span className="relative z-10">冒険ストーリーを生成する</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: racks.length * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link href="/castle/hanger/register" className="block h-full">
              <div className="relative overflow-hidden bg-gradient-to-b from-blue-900/80 to-blue-950/80 border-2 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)] h-[280px] cursor-pointer hover:border-amber-500/60 transition-all duration-300 flex flex-col items-center justify-center">
                <motion.div
                  className="mb-6 bg-blue-900/60 rounded-full p-4 text-amber-400"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(251,191,36,0.2)",
                      "0 0 15px rgba(251,191,36,0.4)",
                      "0 0 0 rgba(251,191,36,0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Plus className="h-10 w-10" />
                </motion.div>
                <h3 className="text-xl font-semibold text-amber-400 mb-3">新しいハンガーラックを登録する</h3>
                <p className="text-amber-300/70 text-sm">クリックして登録フォームを開く</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}