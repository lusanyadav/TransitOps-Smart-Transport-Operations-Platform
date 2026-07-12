/**
 * <Checkbox label="Remember me" checked={v} onChange={setV} />
 */
export default function Checkbox({ label, checked, onChange, className = '', disabled = false }) {
  return (
    <label className={`inline-flex items-center gap-2 text-sm text-text-600 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 rounded border-line text-amber-500 focus:ring-2 focus:ring-amber-500/30"
      />
      {label}
    </label>
  );
}
