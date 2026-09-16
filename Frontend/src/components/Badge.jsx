
export default function Badge({
  children,
  status,
  variant,
  className = '',
}) {
  const normStatus = (status || variant || children || '').toString().toLowerCase().replace(/[\s-]/g, '_')

  let style = 'bg-gray-100 text-gray-700 border-gray-200'

  if (['active', 'open', 'completed', 'success', 'verified', 'approved'].includes(normStatus)) {
    style = 'bg-green-50 text-green-700 border-green-200'
  } else if (['in_progress', 'pending', 'review', 'warning'].includes(normStatus)) {
    style = 'bg-amber-50 text-amber-700 border-amber-200'
  } else if (['urgent', 'danger', 'failed', 'declined', 'suspended', 'critical'].includes(normStatus)) {
    style = 'bg-red-50 text-red-700 border-red-200'
  } else if (['assigned', 'info', 'primary'].includes(normStatus)) {
    style = 'bg-red-50/50 text-primary border-primary/20'
  }

  const label = children || (status ? status.toString().replace(/_/g, ' ') : '')

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide capitalize border ${style} ${className}`}
    >
      {label}
    </span>
  )
}
