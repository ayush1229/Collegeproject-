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
import { useAllocationState } from '../hooks/useAllocationState';
import { submitPreferences } from '../api/allocation.api';
import { ROUTES } from '../constants/routes';

const DEFAULT_FILTERS = { type: 'All Types', block: 'All Blocks', status: 'All Rooms' };

function applyFilters(rooms, f) {
  return rooms.filter((r) => {
    if (f.type !== 'All Types' && r.type !== f.type) return false;
    if (f.block !== 'All Blocks' && r.block !== f.block) return false;
    if (f.status === 'Available Only' && r.occupied >= r.total) return false;
    return true;
  });
}

export default function LiveSelectionPage() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const studentId = user ? user.id : null;

  const { state: allocationState } = useAllocationState(studentId);
  const { rooms, loading } = useLiveRooms(allocationState?.hostelId ?? null);
  const { cart, add, remove, moveUp, moveDown, isInCart, isFull, MAX_PREFERENCES } = usePreferenceCart();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredRooms = applyFilters(rooms, filters);
  const isLeader = allocationState?.isLeader ?? false;

  const handleToggle = (roomId) => {
    if (isInCart(roomId)) remove(roomId);
    else if (!isFull) add(roomId);
  };

  const handleSubmit = async (roomIds) => {
    await submitPreferences({
      groupId: allocationState?.groupId,
      submittedBy: studentId,
      hostelId: allocationState?.hostelId,
      batchNumber: allocationState?.batchNumber,
      roundNumber: allocationState?.roundNumber ?? 1,
      preferences: roomIds,
    });
    navigate(ROUTES.LOCKED);
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <LiveRoundTimer round={allocationState?.roundNumber ?? 1} initialSeconds={1112} isLeader={isLeader} />

      <AllocationLayout
        phase="Live Selection"
        batch={`Batch #${allocationState?.batchNumber ?? 'TBD'} - Round ${allocationState?.roundNumber ?? 1}`}
        hostelId={allocationState?.hostelId}
      >
        <div className="flex flex-col gap-4 h-full">
          <PhaseBanner phase="ROUND ACTIVE" sub="Select your room preferences below. Leader submits for the squad." />

          <div className="flex gap-5 items-start flex-1 min-h-0">
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <RoomFilters filters={filters} onChange={setFilters} />
              {loading ? (
                <p className="text-[13px] text-text-secondary py-10 text-center">Loading rooms...</p>
              ) : (
                <RoomGrid rooms={filteredRooms} isInCart={isInCart} onToggle={handleToggle} isLeader={isLeader} />
              )}
            </div>

            <div
              className="w-[260px] shrink-0 bg-card border border-border rounded shadow-sm flex flex-col sticky top-0 self-start"
              style={{ maxHeight: 'calc(100vh - 180px)' }}
            >
              <PreferenceCart
                cart={cart}
                onRemove={remove}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
                isLeader={isLeader}
                MAX_PREFERENCES={MAX_PREFERENCES}
              />
              <SubmissionPanel cart={cart} isLeader={isLeader} onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </AllocationLayout>
    </div>
  );
}
