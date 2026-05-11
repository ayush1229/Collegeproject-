import { useState, useEffect } from 'react';
import AllocationLayout from '../layouts/AllocationLayout';

/* ─── Mock batch queue ───────────────────────────────────────── */
const BATCH_QUEUE = [
  { id: 'Batch #09', status: 'done'    },
  { id: 'Batch #10', status: 'done'    },
  { id: 'Batch #11', status: 'done'    },
  { id: 'Batch #12', status: 'next'    },
  { id: 'Batch #13', eta: '00:45:00',  status: 'pending' },
  { id: 'Batch #14', eta: '01:15:00',  status: 'pending' },
  { id: 'Batch #15', eta: '01:45:00',  status: 'pending' },
  { id: 'Batch #16', eta: '02:15:00',  status: 'pending' },
];

/* ─── Live countdown hook ────────────────────────────────────── */
function useCountdown(initialSeconds) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/* ─── Phase progress bar ─────────────────────────────────────── */
const PHASES = ['PREP', 'WAITING', 'LIVE'];

function PhaseBar({ current = 'WAITING' }) {
  const idx = PHASES.indexOf(current);
  return (
    <div className="flex items-center justify-center gap-0 pt-2 pb-1">
      {PHASES.map((phase, i) => (
        <div key={phase} className="flex flex-col items-center">
          <div className="flex items-center">
            {i > 0 && (
              <div className={`w-20 h-0.5 ${i <= idx ? 'bg-crimson' : 'bg-border'}`} />
            )}
            <div className={[
              'rounded-full transition-all',
              i < idx  ? 'w-3 h-3 bg-crimson' :
              i === idx ? 'w-3.5 h-3.5 bg-white border-2 border-crimson shadow-[0_0_0_3px_rgba(123,28,28,0.15)]' :
                          'w-3 h-3 bg-border-dark',
            ].join(' ')} />
          </div>
          <span className={`text-[9.5px] font-semibold tracking-[0.08em] mt-1.5 ${i === idx ? 'text-crimson font-bold' : 'text-text-muted'}`}>
            {phase}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── List icon ──────────────────────────────────────────────── */
const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const InfoCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <circle cx="12" cy="16.5" r="0.5" fill="currentColor"/>
  </svg>
);

/* ─── Page ───────────────────────────────────────────────────── */
export default function WaitingRoomPage() {
  const countdown = useCountdown(23 * 60 + 41);

  return (
    <AllocationLayout phase="Selection Phase" batch="Batch 2024-A">
      <div className="flex flex-col gap-5">

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-card border border-border rounded shadow-sm px-4 py-3.5">
          <span className="text-text-secondary mt-0.5 shrink-0"><InfoCircle /></span>
          <div>
            <p className="text-[13px] font-bold text-text-primary mb-0.5">Phase 2: Top-Up Enabled</p>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Additional inventory has been released for the upcoming batches. Review the updated grid before your selection window opens.
            </p>
          </div>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-[1fr_268px] gap-5 items-start">

          {/* LEFT ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Rollover banner */}
            <div className="flex items-center justify-between bg-crimson rounded px-5 py-3.5 gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-white font-black text-base opacity-90">!</span>
                <span className="text-white text-[13px] font-extrabold tracking-[0.08em]">ROLLOVER ACTIVE</span>
              </div>
              <div className="px-3.5 py-1.5 border-[1.5px] border-white/50 rounded text-white text-[12px] font-semibold tracking-[0.02em] whitespace-nowrap">
                You enter Batch #12 as RANK #1
              </div>
            </div>

            {/* Countdown card */}
            <div className="bg-card border border-border rounded shadow-sm px-8 py-8 flex flex-col items-center text-center">
              <p className="text-[11px] font-bold tracking-[0.1em] text-text-muted mb-3">TIME UNTIL BATCH #12 BEGINS</p>
              <p className="text-[56px] font-black tracking-[-0.02em] text-crimson leading-none tabular-nums mb-7">
                {countdown}
              </p>
              <PhaseBar current="WAITING" />
            </div>

            {/* Status chips */}
            <div className="grid grid-cols-3 gap-3">
              {[
                ['CURRENT STATUS', 'Rank in Batch #1'],
                ['SQUAD SIZE',     '03 Members'],
                ['ELIGIBLE POOL',  '4-Seat + 3-Seat'],
              ].map(([label, value]) => (
                <div key={label} className="bg-card border border-border rounded shadow-sm px-4 py-4 flex flex-col gap-1">
                  <span className="text-[9.5px] font-bold tracking-[0.1em] text-text-muted">{label}</span>
                  <span className="text-base font-extrabold text-text-primary tracking-tight">{value}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="flex items-center gap-2.5 px-7 py-3.5 bg-crimson text-white text-[12px] font-bold tracking-[0.1em] rounded hover:bg-crimson-dark transition-colors duration-150 border-0 cursor-pointer self-start">
              SCOUT AVAILABLE ROOMS <ArrowRight />
            </button>
          </div>

          {/* RIGHT – Batch queue ─────────────────────────────── */}
          <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
              <span className="text-text-secondary"><ListIcon /></span>
              <span className="text-[11px] font-bold tracking-[0.06em] text-text-primary">Global Queue</span>
            </div>

            <div className="flex flex-col">
              {BATCH_QUEUE.map((batch) => (
                <div
                  key={batch.id}
                  className={[
                    'flex items-center justify-between px-4 py-3 border-b border-border last:border-0',
                    batch.status === 'done'    ? 'opacity-45'    : '',
                    batch.status === 'next'    ? 'bg-canvas border border-border-dark rounded mx-2 my-1 px-3' : '',
                  ].join(' ')}
                >
                  <span className={`text-[13px] font-semibold ${batch.status === 'done' ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                    {batch.id}
                  </span>

                  {batch.status === 'done' && (
                    <span className="text-[10px] font-bold tracking-[0.06em] px-2 py-0.5 bg-canvas border border-border rounded text-text-muted">
                      DONE
                    </span>
                  )}
                  {batch.status === 'next' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold tracking-[0.06em] px-2 py-0.5 bg-crimson text-white rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      NEXT
                    </span>
                  )}
                  {batch.status === 'pending' && (
                    <span className="text-[11.5px] font-semibold text-text-muted tabular-nums">
                      {batch.eta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AllocationLayout>
  );
}
