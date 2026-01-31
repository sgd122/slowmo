'use client'

import { Users, Calendar, Clock, TrendingUp } from 'lucide-react'

interface StatsSummaryProps {
  totalSessions: number
  totalParticipations: number
  totalStudyHours: number
  averageSessionTime: number
}

export function StatsSummary({
  totalSessions,
  totalParticipations,
  totalStudyHours,
  averageSessionTime,
}: StatsSummaryProps) {
  const stats = [
    {
      icon: Calendar,
      label: '총 세션',
      value: totalSessions.toLocaleString(),
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
    },
    {
      icon: Users,
      label: '총 참여',
      value: totalParticipations.toLocaleString(),
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
    },
    {
      icon: Clock,
      label: '총 공부시간',
      value: `${totalStudyHours.toLocaleString()}h`,
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
    {
      icon: TrendingUp,
      label: '평균 세션',
      value: `${averageSessionTime.toFixed(1)}h`,
      gradient: 'from-emerald-500 via-teal-500 to-green-500',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
            />

            {/* Content */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-400 mb-3">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>

              {/* Icon */}
              <div className={`${stat.iconBg} rounded-xl p-3 transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>

            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-50`} />
          </div>
        )
      })}
    </div>
  )
}
