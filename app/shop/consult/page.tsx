"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft, Volume2, VolumeX } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ConsultPage() {
  const [userMessage, setUserMessage] = useState("")
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [chatMessages, setChatMessages] = useState([
    { sender: "mo-chan", text: "おかたづけのことならなんでも相談してね！" },
  ])
  const [currentConversationId, setCurrentConversationId] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages])

  // Focus input on load
  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }, [])

  // Handle chat form submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim()) return

    // Add user message
    setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }])

    try {
      console.log("Sending chat request:", {
        message: userMessage,
        conversationId: currentConversationId,
      })

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          conversation_id: currentConversationId,
          user: "user-123",
          response_mode: "blocking",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "API request failed")
      }

      console.log("Received chat response:", result)

      // Add AI response to chat
      setChatMessages((prev) => [...prev, { sender: "mo-chan", text: result.answer }])

      // Update conversation ID if provided
      if (result.conversation_id) {
        setCurrentConversationId(result.conversation_id)
      }
    } catch (error) {
      console.error("チャット送信エラー:", error)
      setChatMessages((prev) => [
        ...prev,
        { sender: "mo-chan", text: "申し訳ありません。エラーが発生しました。もう一度お試しください。" },
      ])
    }

    // Clear input
    setUserMessage("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-orange-950 text-white">
      <div className="container mx-auto px-4 py-4 flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-amber-300 hover:text-amber-100 hover:bg-amber-800/50"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-amber-300 ml-2">お片付け相談</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-amber-300 hover:text-amber-100 hover:bg-amber-800/50"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          >
            {isSoundEnabled ? (
              <Volume2 className="h-6 w-6" />
            ) : (
              <VolumeX className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Chat container */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-amber-950/80 to-orange-900/80 rounded-lg border-2 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] overflow-hidden">
          {/* Chat header with Mo-chan info */}
          <div className="bg-gradient-to-r from-amber-800 to-orange-800 p-3 border-b border-amber-500 flex items-center">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400">
              <Image
                src="/cow-fairy.webp"
                alt="モーちゃん"
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div className="ml-3">
              <h2 className="font-bold text-amber-200">モーちゃん</h2>
              <p className="text-xs text-amber-300">片付けの妖精</p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "mo-chan" && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400 mr-2 flex-shrink-0">
                    <Image
                      src="/cow-fairy.webp"
                      alt="モーちゃん"
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                      : "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400 ml-2 flex-shrink-0 bg-amber-700">
                    <div className="w-full h-full flex items-center justify-center text-amber-200">
                      <span>あ</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <form
            onSubmit={handleChatSubmit}
            className="p-3 border-t border-amber-600 bg-gradient-to-r from-amber-900 to-orange-900"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (userMessage.trim()) {
                  handleChatSubmit(e)
                }
              }
            }}
          >
            <div className="flex gap-2">
              <Input
                ref={chatInputRef}
                type="text"
                placeholder="メッセージを入力..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="flex-1 bg-amber-100/90 border-amber-500 text-amber-950 placeholder:text-amber-700/70"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white"
              >
                <Send className="h-4 w-4 mr-1" />
                送信
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

