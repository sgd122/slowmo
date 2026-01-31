'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, BarChart3, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const links = [
  { href: '/', label: '홈', icon: Home },
  { href: '/history', label: '히스토리', icon: History },
  { href: '/stats', label: '통계', icon: BarChart3 },
  { href: '/members', label: '멤버', icon: Users },
];

export function Navigation({ mobile = false, onNavigate }: NavigationProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                'group flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-slate-800 text-slate-100 shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-transform group-hover:scale-110',
                  isActive && 'text-slate-300'
                )}
              />
              <span>{label}</span>
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-slate-400" />
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-1">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'group relative flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              isActive
                ? 'text-slate-100'
                : 'text-slate-400 hover:text-slate-100'
            )}
          >
            <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>{label}</span>
            {isActive && (
              <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
