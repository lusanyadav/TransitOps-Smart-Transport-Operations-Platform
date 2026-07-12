import { Search } from 'lucide-react';

/**
 * Top bar shown above every authenticated page.
 * `user` and `role` are placeholder props until auth/backend land.
 */
export default function Navbar({ user = 'Raven K.', role = 'Dispatcher', initials = 'RK' }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-surface px-6">
      <div className="relative w-80 max-w-full">
        <Search
          size={16}
          strokeWidth={2}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-400"
        />
        <input
          type="text"
          placeholder="Search vehicles, drivers, trips..."
          className="w-full rounded-lg border border-line bg-paper py-2 pl-9 pr-3 text-sm text-text-900 placeholder:text-text-400 focus:border-amber-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-text-600">{user}</span>
        <span className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 font-mono text-xs font-semibold text-white">
            {initials}
          </span>
          <span className="text-xs font-medium text-text-600">{role}</span>
        </span>
      </div>
    </header>
  );
}
