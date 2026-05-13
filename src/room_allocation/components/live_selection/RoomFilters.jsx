const TYPES  = ['All Types', '4-Seater', '2-Seater'];
const BLOCKS = ['All Blocks', 'A', 'B', 'C', 'D'];
const STATUS = ['All Rooms', 'Available Only'];

/** Filter bar for the room grid */
export default function RoomFilters({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {[
        { key: 'type',   options: TYPES  },
        { key: 'block',  options: BLOCKS },
        { key: 'status', options: STATUS },
      ].map(({ key, options }) => (
        <select
          key={key}
          value={filters[key]}
          onChange={e => set(key, e.target.value)}
          className="text-[12px] font-semibold text-text-primary bg-card border border-border rounded px-3 py-2 cursor-pointer focus:outline-none focus:border-crimson transition-colors"
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ))}

      <button
        onClick={() => onChange({ type: 'All Types', block: 'All Blocks', status: 'All Rooms' })}
        className="text-[11px] font-bold text-text-muted hover:text-text-primary tracking-[0.04em] border-0 bg-transparent cursor-pointer px-2 py-2 transition-colors"
      >
        RESET
      </button>
    </div>
  );
}
