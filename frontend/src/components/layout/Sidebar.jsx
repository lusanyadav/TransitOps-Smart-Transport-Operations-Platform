import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants/nav';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const { hasAccess } = useAuth();
  const visibleItems = NAV_ITEMS.filter((item) => hasAccess(item.module) !== 'none');

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-ink-950 text-white">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-amber-500 font-mono text-sm font-bold text-ink-950">
          T
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-status-success ring-2 ring-ink-950" />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold">TransitOps</p>
          <p className="text-[10.5px] uppercase tracking-wider text-white/40">Fleet Ops Platform</p>
        </div>
      </div>

      <nav className="scroll-thin flex-1 space-y-1 overflow-y-auto px-3">
        {visibleItems.map(({ label, path, icon: Icon, module }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-500 text-ink-950'
                  : 'text-white/70 hover:bg-ink-800 hover:text-white'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon size={18} strokeWidth={2} />
              {label}
            </span>
            {hasAccess(module) === 'view' && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/50">
                View
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[11px] text-white/30">TransitOps &copy; 2026 &middot; v0.1</p>
      </div>
    </aside>
  );
}
