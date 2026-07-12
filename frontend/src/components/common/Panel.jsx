/**
 * <Panel title="Service Log" action={<Button>...</Button>}>...</Panel>
 */
export default function Panel({ title, action, children, className = '', bodyClassName = 'p-4' }) {
  return (
    <div className={`rounded-xl border border-line bg-surface ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
          {title && <h2 className="text-sm font-semibold text-text-900">{title}</h2>}
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
