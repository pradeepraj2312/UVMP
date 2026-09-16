
import React from 'react'

export default function StatCard({
  label,
  value,
  trend,
  description,
  icon,
  tone = 'primary',
  className = '',
}) {
  const toneStyles = {
    primary: 'bg-slate-50 text-slate-800 border border-slate-200',
    secondary: 'bg-orange-50 text-secondary border border-orange-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-red-50 text-primary border border-red-200',
  }

  const subText = trend || description

  const renderIcon = () => {
    if (!icon) return null
    if (React.isValidElement(icon)) {
      return icon
    }
    const IconComponent = icon
    return <IconComponent className="w-5 h-5" />
  }

  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-xs flex items-center justify-between gap-3.5 ${className}`}>
      <div className="min-w-0 flex-1">
        <span className="text-xs font-medium text-slate-500 block truncate">{label}</span>
        <span className="text-2xl font-mono font-bold tracking-tight text-slate-900 tabular-nums block my-0.5">{value}</span>
        {subText && (
          <span className="text-[11px] font-medium text-slate-600 block truncate">{subText}</span>
        )}
      </div>
      {icon && (
        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${toneStyles[tone] || toneStyles.primary}`}>
          {renderIcon()}
        </div>
      )}
    </div>
  )
}

