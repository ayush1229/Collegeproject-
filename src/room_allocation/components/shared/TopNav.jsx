import { NavLink } from 'react-router-dom';

/* Pages that exist — others render as non-interactive text */
const NAV_LINKS = [
  { label: 'Allocation',  to: '/allocation/squad',    exists: true  },
  { label: 'Squads',      to: '/allocation/squad',    exists: true  },
  { label: 'Preferences', to: null,                   exists: false },
  { label: 'Results',     to: null,                   exists: false },
];

export default function TopNav({ liveStatus = true }) {
  return (
    <header className="flex items-center gap-10 px-8 h-[52px] bg-card border-b border-border sticky top-0 z-50 shrink-0">
      {/* Logo — links to squad lobby */}
      <NavLink to="/allocation/squad" className="text-[13px] font-black tracking-[0.05em] text-crimson whitespace-nowrap shrink-0 no-underline">
        ROOM ALLOCATION
      </NavLink>

      {/* Nav links */}
      <nav className="flex gap-7 flex-1">
        {NAV_LINKS.map(({ label, to, exists }) =>
          exists ? (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                [
                  'text-xs font-medium tracking-[0.02em] pb-[3px] border-b-2 transition-all duration-150 no-underline',
                  isActive
                    ? 'text-crimson font-semibold border-crimson'
                    : 'text-text-secondary border-transparent hover:text-text-primary',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ) : (
            <span
              key={label}
              className="text-xs font-medium tracking-[0.02em] pb-[3px] border-b-2 border-transparent text-text-muted cursor-not-allowed select-none"
              title="Coming soon"
            >
              {label}
            </span>
          )
        )}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          className={[
            'flex items-center gap-1.5 px-3.5 py-[5px] border-[1.5px] border-crimson text-[11px] font-bold tracking-[0.06em] rounded cursor-pointer transition-all duration-150',
            liveStatus
              ? 'bg-crimson text-white'
              : 'bg-transparent text-crimson hover:bg-crimson hover:text-white',
          ].join(' ')}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />
          LIVE STATUS
        </button>

        <button className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:bg-canvas hover:text-text-primary transition-colors duration-150 border-0 bg-transparent cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        <button className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:bg-canvas hover:text-text-primary transition-colors duration-150 border-0 bg-transparent cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
