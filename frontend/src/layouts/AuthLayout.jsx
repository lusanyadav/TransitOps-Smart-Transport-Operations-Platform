export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-paper">
      <aside className="hidden w-[380px] shrink-0 flex-col justify-between bg-ink-950 p-10 text-white lg:flex">
        <div>
          <span className="relative flex h-10 w-10 items-center justify-center rounded-md bg-amber-500 font-mono text-base font-bold text-ink-950">
            T
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-status-success ring-2 ring-ink-950" />
          </span>
          <h1 className="mt-4 text-lg font-semibold">TransitOps</h1>
          <p className="text-xs text-white/40">Smart Transport Operations Platform</p>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-white/40">
            Say login, then role
          </p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>
              <span className="font-medium text-white">Fleet Manager</span>
              <span className="text-white/40"> → Fleet, Maintenance, Analytics</span>
            </li>
            <li>
              <span className="font-medium text-white">Dispatcher</span>
              <span className="text-white/40"> → Dashboard, Trips</span>
            </li>
            <li>
              <span className="font-medium text-white">Safety Officer</span>
              <span className="text-white/40"> → Drivers, Trips (view)</span>
            </li>
            <li>
              <span className="font-medium text-white">Financial Analyst</span>
              <span className="text-white/40"> → Fuel &amp; Exp., Analytics</span>
            </li>
          </ul>
        </div>

        <p className="text-[11px] text-white/30">TransitOps &copy; 2026 &middot; secure sign-in</p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
