import { ChevronDown } from 'lucide-react';

/**
 * <Select label="Vehicle Type" options={['All','Van','Truck']} value={v} onChange={setV} />
 */
export default function Select({ label, options = [], value, onChange, className = '' }) {
  return (
    <label className={`flex items-center gap-2 text-sm text-text-600 ${className}`}>
      {label && <span className="whitespace-nowrap text-xs font-medium text-text-400">{label}</span>}
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="appearance-none rounded-lg border border-line bg-surface py-2 pl-3 pr-8 text-sm text-text-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-400"
        />
      </span>
    </label>
  );
}
