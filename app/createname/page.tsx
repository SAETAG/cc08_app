"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function CreateNamePage() {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここで名前を保存する処理を追加できます
    // 例: localStorage.setItem("playerName", name)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-teal-950">
      <div className="max-w-md w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 bg-opacity-90 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-indigo-400 z-10 relative">
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300 tracking-tight drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
            まずはあなたの名前を教えてね！
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="あなたの名前"
              className="w-full bg-black bg-opacity-50 border-indigo-400 text-white placeholder:text-gray-400 focus:border-yellow-300 focus:ring-yellow-300"
              required
            />
            
            <Link href="/home" className="block">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-4 px-8 rounded-lg border border-orange-500 text-lg sm:text-xl transition-colors duration-200"
              >
                完了！
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
