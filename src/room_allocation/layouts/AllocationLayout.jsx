import { NavLink } from 'react-router-dom';
import TopNav from '../components/shared/TopNav';

/* ── Icons ────────────────────────────────────────────────────── */
const GridIcon   = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>;
const SquadIcon  = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M14.5 13c0-1.933-1.119-3.603-2.75-4.404" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const RoomIcon   = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="11" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M5 14V9h6v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/></svg>;
const ClockIcon  = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const HelpIcon   = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5.5a1.5 1.5 0 1 1 0 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.75" fill="currentColor"/></svg>;
const CogIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.05-6.95-1.41 1.41M5.46 18.54l-1.41 1.41M18.54 18.54l-1.41-1.41M5.46 5.46 4.05 4.05"/></svg>;
const LogoutIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const UserIcon   = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/></svg>;

/*
 * Sidebar nav config.
 *  to    – react-router path, or null if the page doesn't exist yet
 *  Icon  – icon component
 */
const NAV_ITEMS = [
  { label: 'Overview',  Icon: GridIcon,  to: null                      },
  { label: 'My Squad',  Icon: SquadIcon, to: '/allocation/squad'        },
  { label: 'Room Grid', Icon: RoomIcon,  to: null                      },
  { label: 'Timeline',  Icon: ClockIcon, to: '/allocation/waiting-room' },
  { label: 'Support',   Icon: HelpIcon,  to: null                      },
];

/* Shared class builders */
const navBase   = 'flex items-center gap-2.5 px-2.5 py-[9px] rounded text-[11px] font-semibold tracking-[0.06em] w-full text-left transition-colors duration-150 border-0 cursor-pointer no-underline';
const navActive = 'bg-crimson text-white';
const navIdle   = 'text-text-secondary bg-transparent hover:bg-canvas hover:text-text-primary';
const navDead   = 'text-text-muted bg-transparent cursor-not-allowed';

/**
 * AllocationLayout
 * Props:
 *   children      – page content
 *   phase         – sidebar profile label
 *   batch         – sidebar profile sub-label
 *   lockEnabled   – activates the Lock Selection button
 */
export default function AllocationLayout({
  children,
  phase       = 'Selection Phase',
  batch       = 'Batch TBD',
  lockEnabled = false,
}) {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <TopNav liveStatus />

      <div className="flex flex-1 min-h-0">
        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="w-[200px] shrink-0 bg-card border-r border-border flex flex-col sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">

          {/* Profile */}
          <div className="px-4 pt-5 pb-4 border-b border-border">
            <div className="w-[52px] h-[52px] rounded bg-[#eeeeec] border border-border-dark flex items-center justify-center text-text-muted mb-2.5">
              <UserIcon />
            </div>
            <p className="text-[13px] font-bold text-text-primary leading-tight">{phase}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{batch}</p>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-0.5 p-2.5 flex-1">
            {NAV_ITEMS.map(({ label, Icon, to }) =>
              to ? (
                /* Linked — NavLink handles active state automatically */
                <NavLink
                  key={label}
                  to={to}
                  className={({ isActive }) =>
                    `${navBase} ${isActive ? navActive : navIdle}`
                  }
                >
                  <span className="shrink-0"><Icon /></span>
                  {label.toUpperCase()}
                </NavLink>
              ) : (
                /* No page yet — non-interactive */
                <span
                  key={label}
                  className={`${navBase} ${navDead}`}
                  title="Coming soon"
                >
                  <span className="shrink-0"><Icon /></span>
                  {label.toUpperCase()}
                </span>
              )
            )}
          </nav>

          {/* Bottom actions */}
          <div className="p-2.5 border-t border-border flex flex-col gap-1.5 mt-auto">
            <button
              disabled={!lockEnabled}
              className="w-full py-[9px] px-2.5 border-[1.5px] border-border-dark text-text-muted text-[11px] font-bold tracking-[0.06em] rounded cursor-not-allowed bg-transparent"
            >
              LOCK SELECTION
            </button>
            <button className="flex items-center gap-2 px-2.5 py-2 rounded text-[11px] font-semibold tracking-[0.06em] text-text-secondary hover:bg-canvas hover:text-text-primary transition-colors duration-150 border-0 bg-transparent cursor-pointer w-full">
              <CogIcon /> SETTINGS
            </button>
            <button className="flex items-center gap-2 px-2.5 py-2 rounded text-[11px] font-semibold tracking-[0.06em] text-text-secondary hover:bg-canvas hover:text-text-primary transition-colors duration-150 border-0 bg-transparent cursor-pointer w-full">
              <LogoutIcon /> LOGOUT
            </button>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────── */}
        <main className="flex-1 min-w-0 p-7 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
