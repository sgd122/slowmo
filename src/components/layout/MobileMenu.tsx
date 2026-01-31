'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Navigation } from './Navigation'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-16 border-b border-slate-800 bg-slate-950 py-4 md:hidden">
          <div className="mx-auto max-w-7xl px-4">
            <Navigation mobile onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
