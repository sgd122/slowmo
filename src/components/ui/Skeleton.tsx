import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', ...props }, ref) => {
    const variants = {
      text: 'h-4 rounded-md',
      circular: 'rounded-full aspect-square',
      rectangular: 'h-12 rounded-lg'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%]',
          'animate-[shimmer_2s_ease-in-out_infinite]',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export { Skeleton }
