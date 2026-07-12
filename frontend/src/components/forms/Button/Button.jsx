const VARIANTS = {
  primary:
    'bg-amber-500 text-ink-950 hover:bg-amber-600 focus:ring-amber-500/30 disabled:bg-amber-500/40 disabled:text-ink-950/50',
  secondary:
    'bg-surface text-text-600 border border-line hover:bg-paper focus:ring-amber-500/20 disabled:text-text-400',
  danger:
    'bg-status-danger text-white hover:bg-status-danger/90 focus:ring-status-danger/30 disabled:bg-status-danger/40',
  ghost:
    'bg-transparent text-text-600 hover:bg-paper focus:ring-amber-500/20 disabled:text-text-400',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

/**
 * <Button variant="primary" icon={Plus} onClick={...}>Add Vehicle</Button>
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  disabled = false,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2.25} />}
      {children}
    </button>
  );
}
