import { Construction } from 'lucide-react';

export default function ComingSoon({ title }) {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface text-center">
      <span className="mb-3 rounded-full bg-paper p-3 text-text-400">
        <Construction size={22} strokeWidth={2} />
      </span>
      <p className="text-sm font-semibold text-text-900">{title}</p>
      <p className="mt-1 text-sm text-text-400">This page is being built next.</p>
    </div>
  );
}
