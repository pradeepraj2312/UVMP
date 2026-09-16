
export default function Table({
  columns = [],
  rows = [],
  emptyMessage = 'No records found.',
  className = '',
  ariaLabel = 'Data table',
}) {
  return (
    <div className={`w-full overflow-x-auto rounded-control ${className}`}>
      <table className="w-full min-w-[600px] text-left border-collapse" aria-label={ariaLabel}>
        <thead>
          <tr className="border-b border-border bg-gray-50/70">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-heading"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length > 0 ? (
            rows.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-gray-50/60 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4 text-xs text-accent whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-xs text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
