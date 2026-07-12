/**
 * <NumberInput label="Cargo Weight (kg)" value={v} onChange={setV} />
 */
export default function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  suffix,
  error,
  className = '',
  ...rest
}) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-400">
          {label}
        </span>
      )}
      <span className="relative flex items-center">
        <input
          type="number"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value === '' ? '' : Number(e.target.value))}
          className={`w-full rounded-lg border bg-surface px-3 py-2 font-mono text-sm text-text-900 placeholder:font-sans placeholder:text-text-400 focus:outline-none focus:ring-2 ${
            error
              ? 'border-status-danger focus:ring-status-danger/20'
              : 'border-line focus:border-amber-500 focus:ring-amber-500/20'
          } ${suffix ? 'pr-12' : ''}`}
          {...rest}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 text-xs font-medium text-text-400">
            {suffix}
          </span>
        )}
      </span>
      {error && <span className="mt-1 block text-xs text-status-danger">{error}</span>}
    </label>
  );
}
