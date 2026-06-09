import { NavLink, useNavigate } from 'react-router-dom';
import { useActiveBatch } from '../../hooks/useActiveBatch';
import { triggerDevPhase, triggerResetPhase } from '../../api/allocation.api';

/* Pages that exist — others render as non-interactive text */
const NAV_LINKS = [
  { label: 'Allocation',   to: '/allocation',              exists: true  },
  { label: 'Squads',       to: '/allocation/squad',        exists: true  },
  { label: 'Preferences',  to: '/allocation/preferences',  exists: true  },
  { label: 'Results',      to: '/allocation/results',      exists: true  },
  { label: 'History',      to: '/allocation/history',      exists: true  },
];

/** Derive live-status chip appearance from the current system phase */
function getLiveStatusStyle(phase) {
  switch (phase) {
    case 'LIVE_BATCHES':
      return { label: 'LIVE', filled: true,  color: 'border-crimson bg-crimson text-white' };
    case 'SOFT_LOCK':
      return { label: 'SOFT LOCK', filled: false, color: 'border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white' };
    case 'FINAL_SWEEP':
      return { label: 'FINAL SWEEP', filled: true, color: 'border-emerald-600 bg-emerald-600 text-white' };
    case 'LOBBY':
      return { label: 'LOBBY OPEN', filled: false, color: 'border-border text-text-muted hover:bg-canvas' };
    default: // ADMIN_MODE or unknown
      return { label: 'INACTIVE', filled: false, color: 'border-border text-text-muted opacity-50 cursor-default' };
  }
}

export default function TopNav({ liveStatus = false }) {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const { data: state } = useActiveBatch(user ? user.id : null);

  const handleAdvancePhase = () => {
    if (!state || !state.hostelId) return alert('No active allocation state');
    
    let targetPhase = 'SOFT_LOCK';
    if (state.phase === 'LOBBY') targetPhase = 'SOFT_LOCK';
    else if (state.phase === 'SOFT_LOCK') targetPhase = 'LIVE_BATCHES';
    else if (state.phase === 'LIVE_BATCHES') targetPhase = 'FINAL_SWEEP';
    else return alert(`Cannot advance from ${state.phase}`);

    if (confirm(`Advance phase to ${targetPhase}?`)) {
      triggerDevPhase(state.hostelId, targetPhase)
        .catch(err => alert(err.message || 'Error advancing phase'));
    }
  };

  const handleResetPhase = () => {
    if (!state) return;
    if (confirm(`Reset entire hostel to LOBBY? This deletes ALL groups, batches, and room locks.`)) {
      triggerResetPhase(state.hostelId)
        .catch(err => alert(err.message || 'Error resetting phase'));
    }
  };

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
              end
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
        {/* Phase-aware live status chip */}
        {(() => {
          const ls = getLiveStatusStyle(state?.phase);
          const isClickable = state?.phase === 'LIVE_BATCHES' || state?.phase === 'SOFT_LOCK';
          return (
            <button
              onClick={() => isClickable && navigate('/allocation/waiting-room')}
              className={[
                'flex items-center gap-1.5 px-3.5 py-[5px] border-[1.5px] text-[11px] font-bold tracking-[0.06em] rounded transition-all duration-150',
                ls.color,
                isClickable ? 'cursor-pointer' : 'cursor-default',
              ].join(' ')}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-current shrink-0 ${ls.filled ? 'animate-pulse' : 'opacity-40'}`} />
              {ls.label}
            </button>
          );
        })()}

        {/* DEV TOOLS (Not for production) */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <button 
              onClick={handleAdvancePhase}
              className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded cursor-pointer border-0"
            >
              ADVANCE PHASE
            </button>
            <button 
              onClick={handleResetPhase}
              className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded cursor-pointer border-0"
            >
              RESET PHASE
            </button>
          </>
        )}

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
