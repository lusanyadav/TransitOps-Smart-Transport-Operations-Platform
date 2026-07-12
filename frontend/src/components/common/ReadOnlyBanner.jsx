import { Eye } from 'lucide-react';

/** Shown at the top of a page when the current role has view-only (not full) access. */
export default function ReadOnlyBanner({ text = "View-only access — your role can't make changes here." }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-status-info/30 bg-status-info-bg px-3 py-2 text-xs font-medium text-status-info">
      <Eye size={14} strokeWidth={2} />
      {text}
    </div>
  );
}
