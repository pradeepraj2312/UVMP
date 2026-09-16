
export default function Card({
  title,
  subtitle,
  description,
  actions,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) {
  return (
    <section className={`bg-white border border-border rounded-card shadow-soft overflow-hidden ${className}`}>
      {(title || subtitle || description || actions) && (
        <div className={`p-5 md:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${headerClassName}`}>
          <div>
            {title && <h2 className="font-heading font-semibold text-base md:text-lg text-accent tracking-tight">{title}</h2>}
            {(subtitle || description) && (
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">{subtitle || description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={`p-5 md:p-6 ${bodyClassName}`}>{children}</div>
    </section>
  )
}
