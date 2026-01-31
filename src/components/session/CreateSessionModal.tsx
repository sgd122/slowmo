import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PlusCircle, Sparkles } from 'lucide-react'

interface CreateSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (title: string | null) => void
}

export function CreateSessionModal({
  isOpen,
  onClose,
  onCreated
}: CreateSessionModalProps) {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      await onCreated(title.trim() || null)
      setTitle('')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setTitle('')
      onClose()
    }
  }

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                새 세션 만들기
              </h2>
              <p className="text-sm text-slate-500">
                함께 공부할 세션을 시작하세요
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="세션 제목 (선택)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 알고리즘 스터디, 영어 공부"
            disabled={isLoading}
            maxLength={100}
            icon={<PlusCircle className="h-4 w-4" />}
          />

          <p className="text-xs text-slate-500">
            제목을 입력하지 않으면 자동으로 날짜가 제목이 됩니다
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              className="flex-1"
            >
              세션 시작하기
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
