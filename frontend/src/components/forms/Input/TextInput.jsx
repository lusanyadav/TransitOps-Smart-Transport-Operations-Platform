/**
 * <TextInput label="Registration No." value={v} onChange={setV} placeholder="GJ01AB1234" />
 */

export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  type = 'text',
  className = '',
  ...rest
}) {
  const inputValue =
    type === 'date' && value
      ? new Date(value).toISOString().split('T')[0]
      : value;

  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-400">
          {label}
        </span>
      )}

      <input
        type={type}
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text-900 placeholder:text-text-400 focus:outline-none focus:ring-2 disabled:bg-paper disabled:text-text-400 ${
          error
            ? 'border-status-danger focus:ring-status-danger/20'
            : 'border-line focus:border-amber-500 focus:ring-amber-500/20'
        }`}
        {...rest}
      />

      {error && (
        <span className="mt-1 block text-xs text-status-danger">
          {error}
        </span>
      )}
    </label>
  );
}