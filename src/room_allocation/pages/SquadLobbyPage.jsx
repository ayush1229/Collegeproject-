import { useState } from 'react';
import AllocationLayout from '../layouts/AllocationLayout';

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */
const CheckIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevronRight= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>;
const PlusIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
const SoloIcon    = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#c8c8c2" strokeWidth="1.2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════════ */
const MEMBERS = [
  { id: 1, name: 'ARJUN SHARMA', role: 'LDR', batch: 'BT-2024', isLeader: true,  initials: 'AS' },
  { id: 2, name: 'PRIYA MEHTA',  role: 'MEM', batch: 'BT-2024', isLeader: false, initials: 'PM' },
  { id: 3, name: 'ROHAN DAS',    role: 'MEM', batch: 'BT-2024', isLeader: false, initials: 'RD' },
  { id: 4, name: null }, // empty slot
];

const MEMBER_INVITES = [
  { id: 1, name: 'VIKRAM KUMAR',  meta: 'CGPA: 8.75    YR: 3' },
  { id: 2, name: 'SNEHA AGARWAL', meta: 'CGPA: 9.10    YR: 3' },
];

const SQUAD_INVITES = [
  { id: 10, abbr: 'SQ', name: 'Squad Alpha (Leader: J. Doe)', meta: 'Avg CGPA: 3.75   Size: 3/4' },
  { id: 11, abbr: 'BE', name: 'Beta House (Leader: M. Smith)', meta: 'Avg CGPA: 3.60   Size: 2/4' },
];

const SENT_INVITES = [
  { id: 1, name: 'KARTIK PANDEY', status: 'PENDING RESPONSE' },
];

const PUBLIC_SQUADS = [
  { id: 1, name: 'Engineering Ops',   req: '3.5+', slots: 1 },
  { id: 2, name: 'Design Collective', req: 'Any',  slots: 2 },
];

/* ── Timeline items change based on hasGroup ── */
const TIMELINE_WITH_GROUP = [
  { label: 'SQUAD FORMATION', sub: 'CURRENT PHASE', active: true  },
  { label: 'PREF LOCKING',    sub: 'OCT 15, 08:00', active: false },
  { label: 'ALLOCATION RUN',  sub: 'OCT 18, 12:00', active: false },
];
const TIMELINE_SOLO = [
  { label: 'Registration',     sub: 'Closed',        done: true,  active: false },
  { label: 'Open Lobby',       sub: 'Closes in 48h', done: false, active: true  },
  { label: 'Batch Generation', sub: 'Pending',       done: false, active: false },
];

/* ── Standing data changes based on hasGroup ── */
const STANDING_WITH_GROUP = { rank: '#47',  cgpa: '9.20', batch: '12/14', countdown: '03D 14H 22M' };
const STANDING_SOLO       = { rank: '#412', cgpa: '3.84', batch: '—',     countdown: '01D 22H 48M' };

/* ══════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════════════ */
function CardHeader({ label, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
      <span className="text-[10.5px] font-bold tracking-[0.1em] text-crimson">{label}</span>
      {right}
    </div>
  );
}

function AcceptRejectRow({ name, meta, abbr, onAccept, onReject }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-border last:border-0 gap-3">
      {abbr && (
        <div className="w-9 h-9 rounded bg-canvas border border-border-dark text-[11px] font-bold text-text-secondary flex items-center justify-center shrink-0">
          {abbr}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold tracking-[0.04em] text-text-primary mb-0.5 truncate">{name}</p>
        <p className="text-[11px] text-text-secondary">{meta}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button onClick={onReject} className="w-[30px] h-[30px] flex items-center justify-center border-[1.5px] border-border-dark text-text-secondary rounded hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150 bg-transparent cursor-pointer">
          <XIcon />
        </button>
        <button onClick={onAccept} className="w-[30px] h-[30px] flex items-center justify-center bg-crimson text-white rounded hover:bg-crimson-dark transition-colors duration-150 border-0 cursor-pointer">
          <CheckIcon />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT 1 — PHASE BANNER
   hasGroup  → "Phase 1 Active"  + deadline countdown
   !hasGroup → "Lobby Phase Open" + 48h info alert style
══════════════════════════════════════════════════════════════ */
function PhaseBanner({ hasGroup }) {
  if (hasGroup) {
    return (
      <div className="flex items-start justify-between bg-card border border-border rounded shadow-sm border-l-4 border-l-crimson pl-5 pr-6 py-4 gap-4">
        <div>
          <h2 className="text-[18px] font-extrabold tracking-tight text-text-primary mb-1.5">Phase 1 Active</h2>
          <p className="text-[12.5px] text-text-secondary leading-relaxed max-w-xl">
            Squad formation is currently open. Ensure all members have accepted invites before the soft lock deadline.
          </p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] font-bold tracking-[0.1em] text-text-muted">DEADLINE</span>
          <span className="text-[22px] font-extrabold tracking-[0.04em] text-text-primary">24:00 HRS</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 bg-card border border-crimson rounded px-4 py-3.5 shadow-sm">
      <svg className="text-crimson mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <circle cx="12" cy="16.5" r="0.5" fill="currentColor"/>
      </svg>
      <div className="flex-1">
        <p className="text-[13px] font-bold text-text-primary mb-0.5">Lobby Phase Open</p>
        <p className="text-[12px] text-text-secondary">You have 48 hours to finalize your squad before Batch Generation locks.</p>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <span className="text-[10px] font-bold tracking-[0.1em] text-text-muted">TIME LEFT</span>
        <span className="text-[18px] font-extrabold tracking-[0.04em] text-crimson">48:00 HRS</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT 2 — SQUAD PANEL  (left column)
   hasGroup  → member list with leader badge + empty slot
   !hasGroup → "You are currently Solo" empty state + CTA
══════════════════════════════════════════════════════════════ */
function SquadPanel({ hasGroup }) {
  if (hasGroup) {
    return (
      <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
        <CardHeader label="MY SQUAD (3/4)" />
        <div className="flex flex-col gap-0.5 p-2">
          {MEMBERS.map((m, idx) =>
            m.name ? (
              <div key={`m-${m.id}`} className={`flex items-center gap-3 px-2.5 py-2.5 rounded ${m.isLeader ? 'border border-border' : ''}`}>
                <div className="w-9 h-9 rounded bg-text-secondary text-white text-[11px] font-bold flex items-center justify-center shrink-0 select-none">
                  {m.initials}
                </div>
                <div>
                  <p className="text-[12px] font-bold tracking-[0.04em] text-text-primary leading-tight">{m.name}</p>
                  <p className="text-[10.5px] text-text-muted tracking-[0.02em]">{m.role} • {m.batch}</p>
                </div>
              </div>
            ) : (
              <div key={`slot-${idx}`} className="flex items-center gap-3 px-2.5 py-2.5 rounded opacity-55">
                <div className="w-9 h-9 rounded border-[1.5px] border-dashed border-border-dark text-text-muted flex items-center justify-center shrink-0">
                  <PlusIcon />
                </div>
                <div>
                  <p className="text-[12px] font-bold tracking-[0.04em] text-text-muted">EMPTY SLOT</p>
                  <p className="text-[10.5px] text-text-muted">Awaiting Invite</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  /* Solo state — same card shell, same position */
  return (
    <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
      <CardHeader label="MY SQUAD" />
      <div className="flex flex-col items-center text-center px-5 py-8 gap-4">
        <SoloIcon />
        <div>
          <h3 className="text-[16px] font-extrabold tracking-tight text-text-primary mb-1.5">You are currently Solo</h3>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Solo allocators are placed in Batch D automatically. Create or join a squad to improve your housing options.
          </p>
        </div>
        <div className="flex gap-2.5 w-full">
          <button className="flex-1 py-2.5 bg-crimson text-white text-[11px] font-bold tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors duration-150 border-0 cursor-pointer">
            CREATE SQUAD
          </button>
          <button className="flex-1 py-2.5 bg-transparent text-text-primary text-[11px] font-bold tracking-[0.06em] rounded border-[1.5px] border-border-dark hover:border-text-primary transition-all duration-150 cursor-pointer">
            BROWSE SQUADS
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT 3 — INVITE INBOX  (center column, top)
   hasGroup  → incoming member invites
   !hasGroup → incoming squad invites (with abbr avatar)
══════════════════════════════════════════════════════════════ */
function InviteInbox({ hasGroup }) {
  const initial = hasGroup ? MEMBER_INVITES : SQUAD_INVITES;
  const [items, setItems] = useState(initial);
  const remove = (id) => setItems(p => p.filter(i => i.id !== id));

  return (
    <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
      <CardHeader
        label="INVITE INBOX"
        right={
          items.length > 0
            ? <span className="bg-crimson text-white text-[10px] font-bold tracking-[0.06em] px-2 py-0.5 rounded">{items.length} PENDING</span>
            : null
        }
      />
      {items.length === 0
        ? <p className="text-[12px] text-text-muted text-center py-5">No pending invites</p>
        : items.map(inv => (
            <AcceptRejectRow
              key={inv.id}
              name={inv.name}
              meta={inv.meta}
              abbr={inv.abbr}
              onAccept={() => remove(inv.id)}
              onReject={() => remove(inv.id)}
            />
          ))
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT 4 — CENTER BOTTOM PANEL  (center column, bottom)
   hasGroup  → Sent Invites
   !hasGroup → Public Squads (browse / join)
══════════════════════════════════════════════════════════════ */
function CenterBottomPanel({ hasGroup }) {
  const [sent, setSent] = useState(SENT_INVITES);

  if (hasGroup) {
    return (
      <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
        <CardHeader label="SENT INVITES" />
        {sent.length === 0
          ? <p className="text-[12px] text-text-muted text-center py-5">No sent invites</p>
          : sent.map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3.5 border-b border-border last:border-0 bg-canvas gap-3">
                <div>
                  <p className="text-[12px] font-bold tracking-[0.04em] text-text-primary mb-0.5">{s.name}</p>
                  <p className="text-[11px] text-text-muted">{s.status}</p>
                </div>
                <button onClick={() => setSent(p => p.filter(x => x.id !== s.id))} className="text-crimson text-[11px] font-bold tracking-[0.04em] underline border-0 bg-transparent cursor-pointer hover:text-crimson-dark">
                  REVOKE
                </button>
              </div>
            ))
        }
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
      <CardHeader label="PUBLIC SQUADS" />
      {PUBLIC_SQUADS.map(sq => (
        <div key={sq.id} className="flex items-center px-4 py-3.5 border-b border-border last:border-0 hover:bg-canvas cursor-pointer transition-colors duration-100 gap-2">
          <div className="flex-1">
            <p className="text-[12.5px] font-bold text-text-primary">{sq.name}</p>
            <p className="text-[11px] text-text-muted">Req: {sq.req} • {sq.slots} slot{sq.slots !== 1 ? 's' : ''} left</p>
          </div>
          <span className="text-text-muted"><ChevronRight /></span>
        </div>
      ))}
      <button className="w-full py-2.5 text-[12px] font-semibold text-text-primary border-t border-border hover:bg-canvas transition-colors duration-100 cursor-pointer bg-transparent">
        View All
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT 5 — YOUR STANDING  (right column, top)
   Same component — data differs via hasGroup
══════════════════════════════════════════════════════════════ */
function YourStanding({ hasGroup }) {
  const d = hasGroup ? STANDING_WITH_GROUP : STANDING_SOLO;
  return (
    <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
      <CardHeader label="YOUR STANDING" />
      <div className="px-4 pt-3 pb-1">
        <p className="text-[10.5px] text-text-muted font-semibold tracking-[0.06em] mb-0.5">Global Rank</p>
        <p className="text-[26px] font-black tracking-tight text-text-primary">{d.rank}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 px-4 py-2">
        {[['CGPA', d.cgpa], ['Batch', d.batch]].map(([l, v]) => (
          <div key={l} className="bg-canvas rounded px-3 py-2.5 flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold tracking-[0.06em] text-text-muted">{l}</span>
            <span className="text-base font-black text-text-primary">{v}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 pt-1">
        <p className="text-[10px] font-bold tracking-[0.1em] text-crimson mb-0.5">LOCK COUNTDOWN</p>
        <p className="text-[20px] font-black tracking-[0.04em] text-crimson">{d.countdown}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT 6 — TIMELINE  (right column, bottom)
   Same component — items differ via hasGroup
══════════════════════════════════════════════════════════════ */
function Timeline({ hasGroup }) {
  const items = hasGroup ? TIMELINE_WITH_GROUP : TIMELINE_SOLO;
  return (
    <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
      <CardHeader label="TIMELINE" />
      <div className="relative flex flex-col px-4 py-3">
        {items.map((t, i) => (
          <div key={i} className="flex items-start gap-2.5 py-2 relative">
            {i < items.length - 1 && (
              <div className="absolute left-[5px] top-[18px] w-px h-full bg-border" />
            )}
            <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 z-10 relative ${
              t.done   ? 'bg-text-muted' :
              t.active ? 'bg-crimson ring-2 ring-crimson/20' :
                         'border-[1.5px] border-border-dark bg-transparent'
            }`} />
            <div>
              <p className={`text-[11px] font-bold tracking-[0.06em] ${
                t.done   ? 'line-through text-text-muted' :
                t.active ? 'text-crimson' :
                           'text-text-primary'
              }`}>{t.label}</p>
              <p className={`text-[10px] tracking-[0.04em] ${t.active ? 'text-crimson' : 'text-text-muted'}`}>{t.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE — unified 3-column layout for both states
══════════════════════════════════════════════════════════════ */
export default function SquadLobbyPage({ hasGroup = true }) {
  return (
    <AllocationLayout phase="Selection Phase" batch="Batch TBD">
      <div className="flex flex-col gap-5">

        {/* Row 0 — Phase Banner */}
        <PhaseBanner hasGroup={hasGroup} />

        {/* Row 1 — 3-column grid */}
        <div className="grid grid-cols-[260px_1fr_260px] gap-5 items-start">

          {/* LEFT — Squad / Solo panel */}
          <SquadPanel hasGroup={hasGroup} />

          {/* CENTER — Inbox + (Sent | Public Squads) */}
          <div className="flex flex-col gap-4">
            <InviteInbox hasGroup={hasGroup} />
            <CenterBottomPanel hasGroup={hasGroup} />
          </div>

          {/* RIGHT — Standing + Timeline */}
          <div className="flex flex-col gap-4">
            <YourStanding hasGroup={hasGroup} />
            <Timeline hasGroup={hasGroup} />
          </div>
        </div>
      </div>
    </AllocationLayout>
  );
}