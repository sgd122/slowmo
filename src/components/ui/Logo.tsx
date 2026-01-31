interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const sizes = {
  sm: { icon: 'h-8 w-8', text: 'text-lg' },
  md: { icon: 'h-10 w-10', text: 'text-xl' },
  lg: { icon: 'h-12 w-12', text: 'text-2xl' },
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      {/* 로고 아이콘: 느린 성장을 상징하는 달팽이 + 코드 */}
      <div className={`${s.icon} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 배경 원 */}
          <circle
            cx="20"
            cy="20"
            r="18"
            className="fill-gradient-to-br from-cyan-500 to-blue-600"
            fill="url(#logoGradient)"
          />

          {/* 달팽이 껍질 (소용돌이) - 느린 성장 상징 */}
          <path
            d="M20 12C24.4 12 28 15.6 28 20C28 22.2 27.1 24.2 25.7 25.7"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M20 16C22.2 16 24 17.8 24 20"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* 코드 브래킷 < > */}
          <path
            d="M14 17L10 20L14 23"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M26 17L30 20L26 23"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* 중앙 점 (커서/포커스) */}
          <circle cx="20" cy="20" r="2" fill="white" />

          {/* 그라데이션 정의 */}
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-slate-100`}>
          나태한 모각코
        </span>
      )}
    </div>
  )
}

// 심플 버전 (아이콘만)
export function LogoIcon({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="20" cy="20" r="18" fill="url(#logoGradientIcon)" />
      <path
        d="M20 12C24.4 12 28 15.6 28 20C28 22.2 27.1 24.2 25.7 25.7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 16C22.2 16 24 17.8 24 20"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 17L10 20L14 23"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M26 17L30 20L26 23"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="20" cy="20" r="2" fill="white" />
      <defs>
        <linearGradient id="logoGradientIcon" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  )
}
