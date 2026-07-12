const ACCENT_CLASSES = {
  info: 'bg-status-info',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  amber: 'bg-amber-500',
  neutral: 'bg-status-neutral',
};

/**
 * KPI stat card for the Dashboard's top row.
 *
 * <DashboardCard label="Active Vehicles" value="53" accent="info" icon={Truck} />
 */
export default function DashboardCard({ label, value, accent = 'neutral', icon: Icon, hint }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface p-4 shadow-sm">
      <span className={`absolute inset-y-0 left-0 w-1 ${ACCENT_CLASSES[accent]}`} />
      <div className="flex items-start justify-between pl-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-400">
            {label}
          </p>
          <p className="mt-1.5 font-mono text-2xl font-semibold text-text-900">{value}</p>
          {hint && <p className="mt-0.5 text-xs text-text-400">{hint}</p>}
        </div>
        {Icon && (
          <span className="rounded-lg bg-paper p-2 text-text-400">
            <Icon size={18} strokeWidth={2} />
          </span>
        )}
      </div>
    </div>
  );
}
