"use client"

import { Plus } from "lucide-react"

interface CreatePostButtonProps {
  onClick: () => void
}

export function CreatePostButton({ onClick }: CreatePostButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-amber-500 text-green-950 flex items-center justify-center shadow-lg hover:bg-amber-400 transition-colors z-20"
      aria-label="新しい投稿を作成"
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}
