// Maps every status string used across the platform to a semantic tone.
// Tones drive color via StatusBadge — keep this the single source of truth
// so a status never accidentally renders two different colors on two pages.
export const STATUS_TONE = {
  Available: 'success',
  Completed: 'success',
  Active: 'success',

  'On Trip': 'info',
  Dispatched: 'info',

  'In Shop': 'warning',
  Pending: 'warning',

  Retired: 'danger',
  Cancelled: 'danger',
  Suspended: 'danger',

  Draft: 'neutral',
  'Off Duty': 'neutral',
  Unassigned: 'neutral',
};

export const getStatusTone = (status) => STATUS_TONE[status] ?? 'neutral';
