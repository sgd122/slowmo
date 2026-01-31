interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const sizes = {
  sm: { icon: 'h-8 w-8', text: 'text-lg' },
  md: { icon: 'h-10 w-10', text: 'text-xl' },
  lg: { icon: 'h-12 w-12', text: 'text-2xl' },
}

// 새로운 나무늘보 로고
function SlothLogoSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="laptopGradient" x1="20" y1="23" x2="30" y2="28">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
      </defs>

      {/* 배경 원 */}
      <circle cx="20" cy="20" r="19" fill="url(#logoGradient)" />
      <circle
        cx="20"
        cy="20"
        r="18"
        className="fill-slate-800"
        stroke="#e2e8f0"
        strokeOpacity="0.1"
      />

      {/* 나뭇가지 */}
      <path
        d="M5 12C10 10, 25 10, 35 14"
        stroke="#64748b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* 나무늘보 몸통 */}
      <path
        d="M13 12.5C10 18, 12 28, 19 32"
        stroke="#94a3b8"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* 나무늘보 얼굴 */}
      <circle cx="15" cy="18" r="5" fill="#cbd5e1" />
      <path
        d="M13 18.5C13.5 19.5, 16.5 19.5, 17 18.5"
        stroke="#475569"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="14" cy="17.5" r="0.5" fill="#475569" />
      <circle cx="16" cy="17.5" r="0.5" fill="#475569" />

      {/* 노트북 */}
      <rect
        x="20"
        y="23"
        width="10"
        height="6"
        rx="1"
        fill="url(#laptopGradient)"
        stroke="#f8fafc"
        strokeWidth="0.5"
      />
      <rect x="19" y="29" width="12" height="1.5" rx="0.5" fill="#94a3b8" />
    </svg>
  )
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      <SlothLogoSvg className={s.icon} />

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
  return <SlothLogoSvg className={className} />
}
