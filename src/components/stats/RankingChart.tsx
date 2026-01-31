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

interface RankingData {
  name: string
  value: number
}

interface RankingChartProps {
  data: RankingData[]
  title: string
  valueLabel: string
  color: string
}

export function RankingChart({ data, title, valueLabel, color }: RankingChartProps) {
  // Generate gradient colors for bars
  const getBarColor = (index: number) => {
    const colors = {
      purple: ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
      blue: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
      orange: ['#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
    }
    const colorArray = colors[color as keyof typeof colors] || colors.purple
    return colorArray[index % colorArray.length]
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-white">{payload[0].payload.name}</p>
          <p className="text-xs text-slate-400 mt-1">
            {valueLabel}: <span className="font-bold text-white">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          {title}
        </h2>
        <div className={`mt-2 h-1 w-20 bg-gradient-to-r ${
          color === 'purple' ? 'from-purple-500 to-fuchsia-500' :
          color === 'blue' ? 'from-cyan-500 to-blue-500' :
          'from-orange-500 to-red-500'
        }`} />
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 text-lg">아직 데이터가 없습니다</p>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              type="number"
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748b"
              style={{ fontSize: '13px', fontWeight: 500 }}
              tick={{ fill: '#cbd5e1' }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}
              animationDuration={1000}
              animationBegin={200}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
