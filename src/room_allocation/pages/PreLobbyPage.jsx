import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AllocationLayout from '../layouts/AllocationLayout';

function useCountdownTo(targetDateStr) {
  const [display, setDisplay] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDateStr) { setDisplay(''); return; }
    const tick = () => {
      const now = new Date();
      const target = new Date(targetDateStr);
      const diffMs = target - now;
      if (diffMs <= 0) { setIsExpired(true); setDisplay('00:00:00'); return; }
      const h = Math.floor(diffMs / 3600000);
      const m = Math.floor((diffMs % 3600000) / 60000);
      const s = Math.floor((diffMs % 60000) / 1000);
      const days = Math.floor(h / 24);
      const hrs = h % 24;
      if (days > 0) {
        setDisplay(`${days}d ${String(hrs).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`);
      } else {
        setDisplay(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDateStr]);

  return { display, isExpired };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

export default function PreLobbyPage({ allocationDate, lobbyOpensAt }) {
  const navigate = useNavigate();
  const { display: countdownDisplay, isExpired } = useCountdownTo(lobbyOpensAt);

  useEffect(() => {
    if (isExpired) {
      // Lobby has opened — refresh to get redirected
      window.location.reload();
    }
  }, [isExpired]);

  const hasDate = !!allocationDate;
  const lobbyDate = lobbyOpensAt ? new Date(lobbyOpensAt) : null;
  const softLockDate = allocationDate
    ? new Date(new Date(allocationDate + 'T00:00:00Z').getTime() - 5 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <AllocationLayout phase="Pre-Registration" batch="Not Started">
      <div className="max-w-2xl mx-auto pt-10 flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold tracking-[0.1em] text-crimson">ROOM ALLOCATION</p>
          <h1 className="text-[26px] font-black text-text-primary tracking-tight">
            {hasDate ? 'Allocation Scheduled' : 'Not Yet Scheduled'}
          </h1>
          <p className="text-[14px] text-text-secondary">
            {hasDate
              ? 'The room allocation process has been scheduled. The portal will open automatically.'
              : 'Room allocation dates have not been set yet. Please check back later.'}
          </p>
        </div>

        {hasDate ? (
          <>
            {/* Countdown card */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <p className="text-[10.5px] font-bold tracking-[0.1em] text-crimson">PORTAL OPENS IN</p>
              </div>
              <div className="px-6 py-8 flex flex-col items-center gap-3">
                <p className="text-[52px] font-black tracking-[-0.02em] text-crimson tabular-nums leading-none">
                  {countdownDisplay || '—'}
                </p>
                <p className="text-[13px] text-text-secondary">
                  {lobbyDate ? formatDate(lobbyDate.toISOString()) : ''} at 9:00 AM
                </p>
              </div>
            </div>

            {/* Schedule timeline */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <p className="text-[10.5px] font-bold tracking-[0.1em] text-crimson">ALLOCATION SCHEDULE</p>
              </div>
              <div className="divide-y divide-border">
                {[
                  { label: 'Portal Opens (Lobby)', date: lobbyDate, note: 'Squad formation begins — 5 days before allocation', active: false },
                  { label: 'Soft Lock Deadline', date: softLockDate, note: 'No more squad changes after this point', active: false },
                  { label: 'Room Selection Day', date: allocationDate ? new Date(allocationDate + 'T00:00:00Z') : null, note: 'Live 1-hour allocation batches (Saturday)', active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-[13px] font-semibold text-text-primary">{item.label}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{item.note}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-medium text-text-secondary">
                        {item.date ? item.date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tentative date banner */}
            <div className="bg-canvas border border-border rounded-xl px-5 py-4 flex items-start gap-3">
              <svg className="text-crimson shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-[12px] text-text-secondary">
                <strong className="text-text-primary">Tentative Allocation Date: </strong>
                {formatDate(allocationDate + 'T00:00:00Z')}
                . This date may be subject to change by hostel administration.
              </p>
            </div>
          </>
        ) : (
          /* No date set */
          <div className="bg-card border border-border rounded-xl px-6 py-12 flex flex-col items-center gap-4 text-center">
            <svg className="text-text-muted" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h2 className="text-[18px] font-bold text-text-primary">No Date Set Yet</h2>
            <p className="text-[13px] text-text-secondary max-w-sm">
              The hostel administration has not yet scheduled room allocation.
              You will receive a notification when dates are confirmed.
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="text-[12px] text-text-muted hover:text-text-primary transition-colors self-center"
        >
          ← Back to Dashboard
        </button>
      </div>
    </AllocationLayout>
  );
}
