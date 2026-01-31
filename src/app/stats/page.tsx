import { StatsSummary, RankingChart, StudyTimeChart } from '@/components/stats'
import { getMemberStats } from '@/actions/member'
import { getSessionHistory } from '@/actions/session'

export default async function StatsPage() {
  // Fetch real data from database
  const members = await getMemberStats()
  const { sessions, total: totalSessions } = await getSessionHistory(1, 1000)

  // Calculate stats from real data
  const totalStudyMinutes = members.reduce((sum, m) => sum + (m.total_study_minutes || 0), 0)
  const totalParticipations = members.reduce((sum, m) => sum + (m.session_count || 0), 0)
  const totalStudyHours = Math.round(totalStudyMinutes / 60)
  const averageSessionTime = totalSessions > 0
    ? Number((totalStudyMinutes / totalSessions / 60).toFixed(1))
    : 0

  // Prepare participation ranking (top 5 by session count)
  const participationRanking = members
    .filter(m => m.session_count > 0)
    .sort((a, b) => b.session_count - a.session_count)
    .slice(0, 5)
    .map(m => ({
      name: m.nickname || m.name,
      value: m.session_count
    }))

  // Prepare study time ranking (top 5 by total study time)
  const studyTimeRanking = members
    .filter(m => m.total_study_minutes > 0)
    .slice(0, 5)
    .map(m => ({
      name: m.nickname || m.name,
      hours: Number((m.total_study_minutes / 60).toFixed(1))
    }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-fuchsia-300 bg-clip-text text-transparent mb-3">
            통계
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            학습 활동과 성과를 한눈에 확인하세요
          </p>
          <div className="mt-4 h-1.5 w-32 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full" />
        </div>

        {/* Summary Cards */}
        <StatsSummary
          totalSessions={totalSessions}
          totalParticipations={totalParticipations}
          totalStudyHours={totalStudyHours}
          averageSessionTime={averageSessionTime}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RankingChart
            data={participationRanking}
            title="참여 횟수 랭킹"
            valueLabel="참여 횟수"
            color="blue"
          />
          <StudyTimeChart data={studyTimeRanking} />
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            통계는 실시간으로 업데이트됩니다
          </p>
        </div>
      </div>
    </main>
  )
}
