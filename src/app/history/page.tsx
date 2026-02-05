import { getSessionHistory } from '@/lib/actions'
import { SessionCard } from '@/components/session/SessionCard'
import { ChevronLeft, ChevronRight, History as HistoryIcon } from 'lucide-react'
import Link from 'next/link'

// ISR: 60초마다 재검증 (히스토리는 자주 변경되지 않음)
export const revalidate = 60

interface HistoryPageProps {
  searchParams: { page?: string }
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const currentPage = Number(searchParams.page) || 1
  const { sessions, total, limit } = await getSessionHistory(currentPage)
  const totalPages = Math.ceil(total / limit)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <HistoryIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">히스토리</h1>
              <p className="text-sm text-slate-400 mt-1">
                총 {total}개의 세션
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {sessions.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700/50">
              <HistoryIcon className="h-10 w-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              아직 세션이 없습니다
            </h2>
            <p className="text-slate-400 mb-8 text-center max-w-md">
              첫 번째 학습 세션을 시작하고 히스토리를 만들어보세요
            </p>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:shadow-xl hover:shadow-violet-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              홈으로 가기
            </Link>
          </div>
        ) : (
          <>
            {/* Session List */}
            <div className="grid gap-4 mb-8">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  participantCount={session.session_participants[0]?.count || 0}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Link
                  href={`/history?page=${currentPage - 1}`}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${
                      currentPage === 1
                        ? 'text-slate-600 cursor-not-allowed bg-slate-800/30'
                        : 'text-white bg-slate-800 hover:bg-slate-700 hover:shadow-lg'
                    }
                  `}
                  aria-disabled={currentPage === 1}
                  tabIndex={currentPage === 1 ? -1 : undefined}
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </Link>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      )
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const prevPage = array[index - 1]
                      const showEllipsis = prevPage && page - prevPage > 1

                      return (
                        <div key={page} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="text-slate-600 px-2">...</span>
                          )}
                          <Link
                            href={`/history?page=${page}`}
                            className={`
                              w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-200
                              ${
                                page === currentPage
                                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                              }
                            `}
                          >
                            {page}
                          </Link>
                        </div>
                      )
                    })}
                </div>

                <Link
                  href={`/history?page=${currentPage + 1}`}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${
                      currentPage === totalPages
                        ? 'text-slate-600 cursor-not-allowed bg-slate-800/30'
                        : 'text-white bg-slate-800 hover:bg-slate-700 hover:shadow-lg'
                    }
                  `}
                  aria-disabled={currentPage === totalPages}
                  tabIndex={currentPage === totalPages ? -1 : undefined}
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
