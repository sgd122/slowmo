export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/50 bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-slate-700 to-slate-900 p-1">
              <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-slate-100">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm text-slate-500">
              &copy; {currentYear} 나태한 모각코. All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-600">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              Powered by Next.js & Supabase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
