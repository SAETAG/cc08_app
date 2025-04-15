import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CreatePostButtonProps {
  onClick: () => void
}

export function CreatePostButton({ onClick }: CreatePostButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-amber-600 hover:bg-amber-500 shadow-lg z-[9999]"
      style={{
        boxShadow: `
          0 0 15px 5px rgba(251, 191, 36, 0.2),
          0 0 30px 10px rgba(251, 191, 36, 0.1)
        `,
      }}
    >
      <Plus className="w-8 h-8 text-white" />
    </Button>
  )
} 