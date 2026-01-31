import Link from 'next/link';
import { Navigation } from './Navigation';
import { AuthButton } from '@/components/auth/AuthButton';
import { MobileMenu } from './MobileMenu';
import { Logo } from '@/components/ui/Logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="transition-all hover:scale-105"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation + Auth */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Navigation />
            <AuthButton />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
