'use client'

import { useState, useRef, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { LogOut, User, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Member } from '@/types'

interface UserMenuProps {
  member: Member
}

export function UserMenu({ member }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
      >
        {member.avatar_url ? (
          <Image
            src={member.avatar_url}
            alt={member.name}
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700">
            <User className="h-4 w-4" />
          </div>
        )}
        <span className="hidden text-sm font-medium sm:inline">
          {member.github_username || member.name}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-xl">
          <div className="border-b border-slate-700 px-4 py-3">
            <p className="text-sm font-medium text-slate-100">{member.name}</p>
            {member.github_username && (
              <p className="text-xs text-slate-400">@{member.github_username}</p>
            )}
            {member.email && (
              <p className="mt-1 text-xs text-slate-500">{member.email}</p>
            )}
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              프로필
            </Link>
          </div>

          <div className="border-t border-slate-700 py-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
