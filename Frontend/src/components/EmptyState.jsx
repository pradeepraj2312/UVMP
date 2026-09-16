import React from 'react'
import { Inbox } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
  icon = Inbox,
  title = 'No items to display',
  description = 'There are currently no records or updates available in this view.',
  action,
  actionLabel,
  onAction,
  className = '',
}) {
  const renderIcon = () => {
    if (!icon) return null
    if (React.isValidElement(icon)) {
      return icon
    }
    const IconComponent = icon
    return <IconComponent className="w-6 h-6" />
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-card bg-gray-50/50 border border-dashed border-border ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-50 text-primary flex items-center justify-center mb-3">
        {renderIcon()}
      </div>
      <h4 className="font-heading font-semibold text-sm text-accent mb-1">{title}</h4>
      <p className="text-xs text-gray-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {action ? (
        <div>{action}</div>
      ) : actionLabel && onAction ? (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

