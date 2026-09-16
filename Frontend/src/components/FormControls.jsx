
export function Input({ label, error, helperText, className = '', id, required, ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const errorId = error && inputId ? `${inputId}-error` : undefined
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-accent mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId || helperId}
        className={`w-full px-3.5 py-2.5 min-h-[42px] bg-white border rounded-control text-sm text-accent placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error && <p id={errorId} className="text-xs text-danger mt-1 font-medium">{error}</p>}
      {helperText && !error && <p id={helperId} className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  )
}

export function FormInput(props) {
  return <Input {...props} />
}

export function Select({ label, error, helperText, options = [], children, className = '', id, required, ...props }) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const errorId = error && selectId ? `${selectId}-error` : undefined
  const helperId = helperText && selectId ? `${selectId}-helper` : undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-accent mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId || helperId}
        className={`w-full px-3.5 py-2.5 min-h-[42px] bg-white border rounded-control text-sm text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-danger focus:border-danger' : 'border-border'
        } ${className}`}
        {...props}
      >
        {children ||
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
      {error && <p id={errorId} className="text-xs text-danger mt-1 font-medium">{error}</p>}
      {helperText && !error && <p id={helperId} className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  )
}

export function Textarea({ label, error, helperText, rows = 3, className = '', id, required, ...props }) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const errorId = error && textareaId ? `${textareaId}-error` : undefined
  const helperId = helperText && textareaId ? `${textareaId}-helper` : undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-accent mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        required={required}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId || helperId}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-control text-sm text-accent placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error && <p id={errorId} className="text-xs text-danger mt-1 font-medium">{error}</p>}
      {helperText && !error && <p id={helperId} className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  )
}
