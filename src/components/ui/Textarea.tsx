import { TextareaHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  showCount?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, showCount, maxLength, onChange, value, id, ...props }, ref) => {
    const [count, setCount] = useState(String(value || '').length)
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length)
      onChange?.(e)
    }

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              'flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors',
              'placeholder:text-slate-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-0 focus-visible:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
              'resize-y',
              error && 'border-red-500 focus-visible:ring-red-500',
              showCount && maxLength && 'pb-8',
              className
            )}
            maxLength={maxLength}
            onChange={handleChange}
            value={value}
            {...props}
          />

          {showCount && maxLength && (
            <div className="absolute bottom-2 right-3 text-xs text-slate-400">
              {count}/{maxLength}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-1.5">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
