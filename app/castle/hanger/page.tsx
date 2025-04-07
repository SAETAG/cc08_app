"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardMedia, Typography, Grid, Container, Box } from '@mui/material'
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, PlayCircle, Shirt, Plus, Home } from "lucide-react"
import { useAuth } from '@/app/contexts/AuthContext'

const initialHangers = []

interface Rack {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function HangerList() {
  const { currentUser, loading: authLoading } = useAuth()
  const [racks, setRacks] = useState<Rack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const startAdventure = (rackId: string) => {
    router.push(`/castle/hanger/${rackId}/generate`)
  }

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
      } catch (err) {
        console.error('Error fetching racks:', err);
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRacks();
  }, [currentUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-[url('/abstract-geometric-shapes.png')] bg-cover bg-center text-amber-300 flex items-center justify-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
        <p className="text-center z-10">認証情報を読み込み中...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[url('/abstract-geometric-shapes.png')] bg-cover bg-center text-amber-300 flex items-center justify-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
        <p className="text-center z-10">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[url('/abstract-geometric-shapes.png')] bg-cover bg-center text-amber-300 flex items-center justify-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
        <p className="text-center text-red-500 z-10">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[url('/abstract-geometric-shapes.png')] bg-cover bg-center text-amber-300 flex flex-col items-center p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
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

          <Link
            href="/castle"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            <span>クローゼット城に戻る</span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-amber-400 tracking-wider">
            あなたのハンガーラック一覧
          </h1>
          <p className="text-lg text-amber-300/80">登録済みのハンガーラックから冒険を始めましょう</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {racks.map((rack, index) => {
            const createdAtDate = new Date(rack.createdAt.seconds * 1000);
            
            return (
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
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent" />
                  </div>

                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

                  <div className="p-4 relative flex-1 flex flex-col">
                    <div className="flex items-center mb-2">
                      <Shirt className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-amber-400 truncate">{rack.name}</h3>
                    </div>
                    <div className="text-sm text-amber-300/80 mb-3">
                      <span>作成日: {createdAtDate.toLocaleDateString()}</span>
                    </div>

                    <div className="mt-auto space-y-2">
                      <motion.button
                        onClick={() => startAdventure(rack.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white py-1.5 px-3 rounded-md shadow-md border border-amber-400/30 flex items-center justify-center gap-1.5 group"
                      >
                        <PlayCircle className="h-4 w-4 group-hover:animate-pulse" />
                        <span>冒険を始める</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: racks.length * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link href="/castle/hanger/register" className="block h-full">
              <div className="relative overflow-hidden bg-gradient-to-b from-blue-900/80 to-blue-950/80 border-2 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)] h-[280px] cursor-pointer hover:border-amber-500/60 transition-all duration-300 flex flex-col items-center justify-center">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold text-amber-400 mb-3">新しいハンガーラックを登録する</h3>
                <p className="text-amber-300/70 text-sm">クリックして登録フォームを開く</p>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}