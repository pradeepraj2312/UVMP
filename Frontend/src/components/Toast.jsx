import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

export default function Toast({
  type = 'info',
  message,
  onDismiss,
  className = '',
}) {
  if (!message) return null

  const config = {
    success: {
      bg: 'bg-green-50 text-green-800 border-green-200',
      icon: CheckCircle2,
      iconColor: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50 text-red-800 border-red-200',
      icon: AlertCircle,
      iconColor: 'text-danger',
    },
    warning: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    info: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  }

  const current = config[type] || config.info
  const Icon = current.icon

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 px-4 py-3 border rounded-control text-xs font-medium ${current.bg} ${className}`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${current.iconColor}`} />
      <div className="flex-1">{message}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="p-1 rounded-xs hover:bg-black/5 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
