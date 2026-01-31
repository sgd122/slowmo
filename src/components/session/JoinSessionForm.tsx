import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { UserPlus, Users, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Member } from '@/types'

interface JoinSessionFormProps {
  sessionId: string
  existingMembers: Member[]
  onJoin: (memberId: string, name: string) => void
}

export function JoinSessionForm({
  sessionId,
  existingMembers,
  onJoin
}: JoinSessionFormProps) {
  const [name, setName] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      await onJoin('', name.trim())
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMember = async (member: Member) => {
    setIsLoading(true)
    try {
      await onJoin(member.id, member.name)
      setShowDropdown(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-500" />
          세션 참여하기
        </CardTitle>
        <CardDescription>
          이름을 입력하거나 기존 멤버를 선택하세요
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* New Member Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            disabled={isLoading}
            icon={<UserPlus className="h-4 w-4" />}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || isLoading}
            loading={isLoading}
          >
            새 멤버로 참여하기
          </Button>
        </form>

        {/* Existing Members */}
        {existingMembers.length > 0 && (
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">또는</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={isLoading}
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                기존 멤버 선택
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                showDropdown && "rotate-180"
              )} />
            </Button>

            {showDropdown && (
              <div className="border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {existingMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleSelectMember(member)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 disabled:opacity-50"
                    >
                      <div className="font-medium text-slate-900">
                        {member.nickname || member.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {member.session_count}회 참여 · 총 {Math.floor(member.total_study_minutes / 60)}시간
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
