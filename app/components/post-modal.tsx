import { X } from "lucide-react"
import { createPortal } from "react-dom"
import { useState, useEffect } from "react"

interface PostModalProps {
  open: boolean
  onClose: () => void
}

export function PostModal({ open, onClose }: PostModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [open])

  if (!mounted || !open) return null

  return createPortal(
    <div className="modal-overlay">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className="bg-green-900/90 border border-amber-200/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto relative mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-amber-100/80 hover:text-amber-200 z-10"
            aria-label="閉じる"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6">
            {/* モーダルの内容をここに実装 */}
            <h2 className="text-2xl text-amber-200 mb-4">新しい投稿を作成</h2>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        body.modal-open {
          overflow: hidden;
        }

        #__next {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>,
    document.body
  )
} 