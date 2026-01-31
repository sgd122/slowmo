import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils/cn'
import { useState, useCallback, useEffect } from 'react'

interface TaskEditorProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  disabled?: boolean
  label?: string
  rows?: number
}

export function TaskEditor({
  value,
  onChange,
  maxLength = 500,
  placeholder,
  disabled = false,
  label,
  rows = 4
}: TaskEditorProps) {
  const [localValue, setLocalValue] = useState(value)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue)

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    const timeout = setTimeout(() => {
      onChange(newValue)
    }, 500)

    setDebounceTimeout(timeout)
  }, [onChange, debounceTimeout])

  const currentLength = localValue.length
  const isNearLimit = currentLength >= maxLength * 0.9

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <Textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className="resize-none"
      />

      <div className="flex justify-end">
        <span className={cn(
          "text-xs transition-colors",
          isNearLimit ? "text-amber-600 font-medium" : "text-slate-400"
        )}>
          {currentLength} / {maxLength}
        </span>
      </div>
    </div>
  )
}
