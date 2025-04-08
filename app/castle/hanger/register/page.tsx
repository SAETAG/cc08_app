"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Camera, X, ArrowLeft, Home } from "lucide-react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '@/lib/firebase';

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export default function HangerRegisterPage() {
  const router = useRouter()
  const [newHangerName, setNewHangerName] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('認証済みユーザー:', user.uid)
        try {
          // トークンを更新
          const token = await user.getIdToken(true)
          console.log('認証トークン更新:', token.substring(0, 20) + '...')
          setCurrentUser(user)
          document.cookie = `userId=${user.uid}; path=/; max-age=3600; SameSite=Strict`
        } catch (error) {
          console.error('トークン更新エラー:', error)
          // 匿名認証を試みる
          try {
            const userCredential = await signInAnonymously(auth)
            console.log('匿名認証成功:', userCredential.user.uid)
            const token = await userCredential.user.getIdToken()
            console.log('認証トークン取得:', token.substring(0, 20) + '...')
            setCurrentUser(userCredential.user)
            document.cookie = `userId=${userCredential.user.uid}; path=/; max-age=3600; SameSite=Strict`
          } catch (anonError) {
            console.error('匿名認証エラー:', anonError)
            toast({
              title: "エラー",
              description: "認証に失敗しました。再度お試しください。",
              variant: "destructive",
            })
            router.push('/')
          }
        }
      } else {
        console.log('匿名認証を試みます...')
        try {
          const userCredential = await signInAnonymously(auth)
          console.log('匿名認証成功:', userCredential.user.uid)
          const token = await userCredential.user.getIdToken()
          console.log('認証トークン取得:', token.substring(0, 20) + '...')
          setCurrentUser(userCredential.user)
          document.cookie = `userId=${userCredential.user.uid}; path=/; max-age=3600; SameSite=Strict`
        } catch (error) {
          console.error('匿名認証エラー:', error)
          toast({
            title: "エラー",
            description: "認証に失敗しました。再度お試しください。",
            variant: "destructive",
          })
          router.push('/')
        }
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setPreviewImage(URL.createObjectURL(selectedFile))
    }
  }

  const handleCameraCapture = () => {
    alert("カメラ機能は実アプリで実装されます")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      toast({
        title: "エラー",
        description: "認証情報が見つかりません。再度ログインしてください。",
        variant: "destructive",
      })
      router.push('/')
      return
    }

    if (!newHangerName.trim()) {
      toast({
        title: "エラー",
        description: "ハンガーラックの名前を入力してください",
        variant: "destructive",
      })
      return
    }

    if (!fileInputRef.current?.files?.[0]) {
      toast({
        title: "エラー",
        description: "画像を選択してください",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      if (!currentUser?.uid) {
        throw new Error('ユーザーIDが見つかりません。再度ログインしてください。')
      }

      // トークンを更新
      const token = await currentUser.getIdToken(true)
      console.log('アップロード前のトークン更新:', token.substring(0, 20) + '...')

      console.log('現在のユーザーID:', currentUser.uid)
      const file = fileInputRef.current.files[0]
      const fileName = `${Date.now()}_${file.name}`
      const storageRef = ref(storage, `images/${currentUser.uid}/${fileName}`)  // パスを変更

      // メタデータを追加
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedBy: currentUser.uid,
          originalName: file.name,
        },
      }

      console.log("アップロード開始:", storageRef.fullPath)
      // Firebase Storageにアップロード
      const snapshot = await uploadBytes(storageRef, file, metadata)
      console.log("アップロード成功:", snapshot.ref.fullPath)
      const imageUrl = await getDownloadURL(snapshot.ref)
      console.log("ダウンロードURL取得:", imageUrl)

      // FormDataとして送信
      const formData = new FormData()
      formData.append("name", newHangerName)
      formData.append("imageUrl", imageUrl)

      // 認証トークンを取得
      const idToken = await currentUser.getIdToken()
      console.log('認証トークン取得:', idToken.substring(0, 20) + '...')

      const response = await fetch("/api/racks/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`
        },
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('API Error:', data)
        throw new Error(data.error + (data.details ? `\n${JSON.stringify(data.details, null, 2)}` : ''))
      }

      toast({
        title: "成功",
        description: "ハンガーラックを登録しました",
      })
      
      router.push("/castle/hanger")
    } catch (error) {
      console.error('Request failed:', error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "登録に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[url('/hanger.png')] bg-cover bg-center text-amber-300 flex justify-center items-start px-4 py-8 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-blue-950/80">
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
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        ))}
      </div>

      <div className="absolute left-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse" />
      <div
        className="absolute right-1/4 top-1/4 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="w-full max-w-2xl z-10 relative">
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

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 tracking-wider">新しいハンガーラックを登録</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="relative overflow-hidden bg-gradient-to-b from-blue-900/90 to-blue-950/90 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hanger-name" className="text-amber-300 text-lg">
                  ハンガーラックの名前
                </Label>
                <Input
                  id="hanger-name"
                  value={newHangerName}
                  onChange={(e) => setNewHangerName(e.target.value)}
                  required
                  placeholder="例：寝室クローゼットの左ハンガーラック"
                  className="bg-blue-950/50 border-amber-500/30 text-amber-100 placeholder:text-amber-300/40 focus:border-amber-400 focus:ring-amber-400/20 text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-amber-300 text-lg">画像</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                {previewImage ? (
                  <div className="relative w-full h-64 border-2 border-dashed border-amber-500/30 rounded-md overflow-hidden bg-blue-950/30">
                    <Image src={previewImage} alt="Preview" fill className="object-contain" />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 bg-blue-950/70 text-amber-400 hover:text-amber-300 hover:bg-blue-900/80 p-2 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-md border-2 border-dashed border-amber-500/30 flex flex-col items-center justify-center p-4 bg-blue-950/30">
                    <Upload className="h-10 w-10 text-amber-400/60 mb-4" />
                    <p className="text-amber-300/80 text-center mb-6">
                      画像をアップロードするか、カメラで撮影してください
                    </p>
                    <div className="flex gap-4">
                      <motion.button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-800/80 hover:bg-blue-700/80 text-amber-300 border border-amber-500/30 py-2 px-4 rounded-md flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        アップロード
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleCameraCapture}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-800/80 hover:bg-blue-700/80 text-amber-300 border border-amber-500/30 py-2 px-4 rounded-md flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        カメラ
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white py-3 px-4 rounded-md shadow-md border border-amber-400/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "登録中..." : "登録する"}
              </motion.button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}