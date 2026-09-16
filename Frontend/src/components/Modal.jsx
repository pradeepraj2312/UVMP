import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-accent/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={`relative bg-white border border-border rounded-card shadow-2xl w-full ${maxWidth} p-6 z-10 animate-in zoom-in-95 duration-150 ${className}`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div>
            {title && <h3 id="modal-title" className="font-heading font-semibold text-lg text-accent">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal dialog"
            className="text-gray-400 hover:text-accent p-2 rounded-control hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
