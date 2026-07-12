import { X } from 'lucide-react';

/**
 * <Modal open={isOpen} onClose={close} title="Add Vehicle">...form...</Modal>
 */
export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <h3 className="text-sm font-semibold text-text-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-text-400 hover:bg-paper hover:text-text-900"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto scroll-thin px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line-soft px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
