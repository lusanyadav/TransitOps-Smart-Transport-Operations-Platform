import { getStatusTone } from '@/constants/status';

const TONE_CLASSES = {
  success: 'bg-status-success-bg text-status-success',
  info: 'bg-status-info-bg text-status-info',
  warning: 'bg-status-warning-bg text-status-warning',
  danger: 'bg-status-danger-bg text-status-danger',
  neutral: 'bg-status-neutral-bg text-status-neutral',
};

/**
 * Small pill used everywhere a record's lifecycle status is shown
 * (vehicles, drivers, trips, maintenance, fuel/expense records).
 *
 * <StatusBadge status="On Trip" />
 * <StatusBadge status="Custom label" tone="warning" />  // override tone explicitly
 */
export default function StatusBadge({ status, tone, className = '' }) {
  const resolvedTone = tone ?? getStatusTone(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${TONE_CLASSES[resolvedTone]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
