'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface StudyTimeData {
  name: string
  hours: number
}

interface StudyTimeChartProps {
  data: StudyTimeData[]
}

export function StudyTimeChart({ data }: StudyTimeChartProps) {
  // Format time to "Xh Ym"
  const formatTime = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  }

  // Generate gradient colors for bars
  const gradientColors = [
    '#f97316', // orange-500
    '#ea580c', // orange-600
    '#dc2626', // red-600
    '#c2410c', // orange-700
    '#991b1b', // red-800
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-white">{payload[0].payload.name}</p>
          <p className="text-xs text-slate-400 mt-1">
            공부 시간: <span className="font-bold text-orange-400">{formatTime(payload[0].value)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    return (
      <text x={x} y={y} dy={4} textAnchor="end" fill="#cbd5e1" fontSize={12} fontWeight={500}>
        {formatTime(payload.value)}
      </text>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          공부 시간 랭킹
        </h2>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500" />
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <XAxis
              type="number"
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tick={{ fill: '#94a3b8' }}
              tickFormatter={formatTime}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748b"
              style={{ fontSize: '13px', fontWeight: 500 }}
              tick={{ fill: '#cbd5e1' }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(251, 146, 60, 0.1)' }} />
            <Bar
              dataKey="hours"
              radius={[0, 8, 8, 0]}
              animationDuration={1000}
              animationBegin={200}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={gradientColors[index % gradientColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
