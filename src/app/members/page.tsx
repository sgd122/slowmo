import { getMemberStats } from '@/actions/member'
import { MemberCard } from '@/components/member'
import { Users, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import type { Member } from '@/types'

interface MembersPageProps {
  searchParams: { sort?: string }
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const members = await getMemberStats()
  const sortBy = searchParams.sort || 'name'

  // Sort members based on query parameter
  const sortedMembers = [...members].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return b.total_study_minutes - a.total_study_minutes
      case 'count':
        return b.session_count - a.session_count
      case 'name':
      default:
        return a.name.localeCompare(b.name, 'ko-KR')
    }
  })

  const sortOptions = [
    { value: 'name', label: '이름순' },
    { value: 'time', label: '학습시간순' },
    { value: 'count', label: '참여횟수순' }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">멤버</h1>
                <p className="text-sm text-slate-400 mt-1">
                  총 {members.length}명의 멤버
                </p>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
              <ArrowUpDown className="h-4 w-4 text-slate-400 ml-2" />
              {sortOptions.map((option) => (
                <Link
                  key={option.value}
                  href={`/members?sort=${option.value}`}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {sortedMembers.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700/50">
              <Users className="h-10 w-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              아직 멤버가 없습니다
            </h2>
            <p className="text-slate-400 mb-8 text-center max-w-md">
              첫 번째 멤버를 추가하고 함께 학습을 시작해보세요
            </p>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              홈으로 가기
            </Link>
          </div>
        ) : (
          /* Member Grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
