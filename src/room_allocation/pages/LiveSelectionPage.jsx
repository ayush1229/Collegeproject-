import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AllocationLayout from '../layouts/AllocationLayout';
import LiveRoundTimer from '../components/live_selection/LiveRoundTimer';
import RoomFilters from '../components/live_selection/RoomFilters';
import RoomGrid from '../components/live_selection/RoomGrid';
import PreferenceCart from '../components/live_selection/PreferenceCart';
import SubmissionPanel from '../components/live_selection/SubmissionPanel';
import PhaseBanner from '../components/shared/PhaseBanner';
import { useLiveRooms } from '../hooks/useLiveRooms';
import { usePreferenceCart } from '../hooks/usePreferenceCart';
import { submitPreferences } from '../api/allocation.api';
import { ROUTES } from '../constants/routes';

const DEFAULT_FILTERS = { type: 'All Types', block: 'All Blocks', status: 'All Rooms' };

function applyFilters(rooms, f) {
  return rooms.filter(r => {
    if (f.type  !== 'All Types'   && r.type  !== f.type)                      return false;
    if (f.block !== 'All Blocks'  && r.block !== f.block)                      return false;
    if (f.status === 'Available Only' && r.occupied >= r.total)                return false;
    return true;
  });
}

/* Mock — in prod this comes from auth/context */
const IS_LEADER = true;

export default function LiveSelectionPage() {
  const navigate = useNavigate();
  const { rooms, loading } = useLiveRooms();
  const { cart, add, remove, moveUp, moveDown, isInCart, isFull, MAX_PREFERENCES } = usePreferenceCart();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredRooms = applyFilters(rooms, filters);

  const handleToggle = (roomId) => {
    if (isInCart(roomId)) remove(roomId);
    else if (!isFull) add(roomId);
  };

  const handleSubmit = async (roomIds) => {
    await submitPreferences(roomIds);
    navigate(ROUTES.LOCKED);
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Sticky round timer — sits above AllocationLayout's TopNav */}
      <LiveRoundTimer round={2} initialSeconds={1112} isLeader={IS_LEADER} />

      <AllocationLayout phase="Live Selection" batch="Batch #12 — Round 2">
        <div className="flex flex-col gap-4 h-full">
          <PhaseBanner phase="ROUND 2 ACTIVE" sub="Select your room preferences below. Leader submits for the squad." />

          <div className="flex gap-5 items-start flex-1 min-h-0">
            {/* LEFT — Filters + Grid */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <RoomFilters filters={filters} onChange={setFilters} />
              {loading
                ? <p className="text-[13px] text-text-secondary py-10 text-center">Loading rooms…</p>
                : <RoomGrid rooms={filteredRooms} isInCart={isInCart} onToggle={handleToggle} isLeader={IS_LEADER} />
              }
            </div>

            {/* RIGHT — Preference cart (sticky) */}
            <div className="w-[260px] shrink-0 bg-card border border-border rounded shadow-sm flex flex-col sticky top-0 self-start" style={{ maxHeight: 'calc(100vh - 180px)' }}>
              <PreferenceCart
                cart={cart}
                onRemove={remove}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
                isLeader={IS_LEADER}
                MAX_PREFERENCES={MAX_PREFERENCES}
              />
              <SubmissionPanel cart={cart} isLeader={IS_LEADER} onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </AllocationLayout>
    </div>
  );
}
