import { HTMLAttributes, forwardRef, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  description?: string
  showCloseButton?: boolean
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open, onClose, children, title, description, showCloseButton = true, ...props }, ref) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          onClose()
        }
      }

      if (open) {
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleEscape)
      }

      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }, [open, onClose])

    if (!open) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className={cn(
            'fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity',
            open ? 'animate-in fade-in duration-200' : 'animate-out fade-out duration-200'
          )}
          onClick={onClose}
        />

        {/* Modal Content */}
        <div
          ref={ref}
          className={cn(
            'relative z-50 w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border border-slate-200',
            open ? 'animate-in zoom-in-95 duration-200' : 'animate-out zoom-out-95 duration-200',
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || description || showCloseButton) && (
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="space-y-1.5">
                {title && (
                  <h2 className="text-xl font-semibold text-slate-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-slate-500">
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

export { Modal }
