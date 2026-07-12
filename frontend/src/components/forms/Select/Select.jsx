import { ChevronDown } from 'lucide-react';

/**
 * <Select label="Vehicle Type" options={['All','Van','Truck']} value={v} onChange={setV} />
 * <Select label="Driver" options={[{value:'Alex',label:'Alex'},{value:'John',label:'John (Suspended)',disabled:true}]} value={v} onChange={setV} placeholder="Select driver" />
 */
export default function Select({ label, options = [], value, onChange, placeholder, stacked = false, className = '', disabled = false }) {
  const normalized = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
  return (
    <label className={`${stacked ? 'block' : 'flex items-center gap-2'} text-sm text-text-600 ${className}`}>
      {label && (
        <span className={stacked ? 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-400' : 'whitespace-nowrap text-xs font-medium text-text-400'}>
          {label}
        </span>
      )}
      <span className="relative block w-full">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none rounded-lg border border-line bg-surface py-2 pl-3 pr-8 text-sm text-text-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-paper disabled:text-text-400"
        >
          
            <option value="" disabled>
              {placeholder || 'Select an option'}
            </option>
          
          {normalized.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
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