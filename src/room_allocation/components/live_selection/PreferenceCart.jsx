import PreferenceSlot from './PreferenceSlot';

/** Sticky sidebar cart showing ordered preferences */
export default function PreferenceCart({ cart, onRemove, onMoveUp, onMoveDown, isLeader, MAX_PREFERENCES }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-[10.5px] font-bold tracking-[0.1em] text-crimson">PREFERENCE CART</p>
        <p className="text-[11px] text-text-muted mt-0.5">{cart.length}/{MAX_PREFERENCES} selected</p>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-canvas border border-border flex items-center justify-center text-text-muted">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="14" height="11" rx="1"/><path d="M5 14V9h6v5"/>
              </svg>
            </div>
            <p className="text-[12px] font-bold text-text-primary">No rooms selected</p>
            <p className="text-[11px] text-text-secondary">Click rooms in the grid to add them here</p>
          </div>
        ) : (
          cart.map((roomId, i) => (
            <PreferenceSlot
              key={roomId}
              rank={i + 1}
              roomId={roomId}
              onRemove={() => onRemove(roomId)}
              onMoveUp={() => onMoveUp(i)}
              onMoveDown={() => onMoveDown(i)}
              isFirst={i === 0}
              isLast={i === cart.length - 1}
            />
          ))
        )}
      </div>

      {/* Filled slot indicators */}
      {Array.from({ length: MAX_PREFERENCES - cart.length }).map((_, i) => (
        <div key={i} className="mx-3 mb-1.5 px-3 py-2.5 rounded border border-dashed border-border flex items-center gap-2.5 opacity-40">
          <span className="w-5 h-5 rounded-full border border-border-dark text-[10px] text-text-muted flex items-center justify-center shrink-0">
            {cart.length + i + 1}
          </span>
          <span className="text-[12px] text-text-muted">Empty slot</span>
        </div>
      ))}
    </div>
  );
}
