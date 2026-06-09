import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomFilters from './RoomFilters';
import RoomGrid from './RoomGrid';
import PreferenceCart from './PreferenceCart';
import SubmissionPanel from './SubmissionPanel';
import PhaseBanner from '../shared/PhaseBanner';
import { useRooms } from '../../hooks/useRooms';
import { usePreferenceCart } from '../../hooks/usePreferenceCart';
import { submitPreferences } from '../../api/allocation.api';
import { ROUTES } from '../../constants/routes';

const DEFAULT_FILTERS = { type: 'All Types', block: 'All Blocks', status: 'All Rooms' };

function applyFilters(rooms, f) {
  return rooms.filter((r) => {
    if (f.type !== 'All Types' && r.type !== f.type) return false;
    if (f.block !== 'All Blocks' && r.block !== f.block) return false;
    if (f.status === 'Available Only' && r.occupied >= (r.total || r.capacity)) return false;
    return true;
  });
}

export default function PreferenceBuilder({
  studentId,
  allocationState,
  isLiveMode = false,
  onClose = null
}) {
  const navigate = useNavigate();
  const hostelId = allocationState?.hostelId ?? null;
  const isLeader = allocationState?.isLeader ?? false;

  const { data: rooms = [], isLoading: loading } = useRooms(hostelId, studentId);
  const { cart, add, remove, moveUp, moveDown, isInCart, isFull, MAX_PREFERENCES, clear } = usePreferenceCart(studentId);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredRooms = applyFilters(rooms, filters);

  const handleToggle = (roomId) => {
    if (isInCart(roomId)) remove(roomId);
    else if (!isFull) add(roomId);
  };

  const handleSubmit = async (roomIds) => {
    if (!isLiveMode) {
      alert("Preferences saved locally! You can only submit during your live batch.");
      if (onClose) onClose();
      return;
    }

    try {
      await submitPreferences({
        groupId: allocationState?.groupId,
        submittedBy: studentId,
        hostelId: allocationState?.hostelId,
        batchNumber: allocationState?.batchNumber,
        roundNumber: allocationState?.roundNumber ?? 1,
        preferences: roomIds,
      });
      // Clear cart on successful submit to avoid stale data later
      clear();
      if (onClose) onClose();
      navigate(ROUTES.LOCKED);
    } catch (err) {
      alert(err.message || 'Failed to submit preferences');
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-full bg-canvas">
      {isLiveMode ? (
        <PhaseBanner 
          phase="ROUND ACTIVE" 
          sub="Select your room preferences below. Leader submits for the squad." 
        />
      ) : (
        <PhaseBanner 
          phase="PREFERENCE BUILDER" 
          sub="Pre-configure your preferences here. They are saved automatically to this device." 
          color="bg-amber-500"
        />
      )}

      {onClose && !isLiveMode && (
        <div className="flex justify-end -mt-2 mb-2">
          <button 
            onClick={onClose}
            className="text-[12px] font-bold text-text-secondary hover:text-text-primary underline cursor-pointer"
          >
            Close & Go Back
          </button>
        </div>
      )}

      <div className="flex gap-5 items-start flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <RoomFilters filters={filters} onChange={setFilters} />
          {loading ? (
            <p className="text-[13px] text-text-secondary py-10 text-center">Loading rooms...</p>
          ) : (
            <RoomGrid 
              rooms={filteredRooms} 
              isInCart={isInCart} 
              onToggle={handleToggle} 
              isLeader={isLeader || !isLiveMode} 
            />
          )}
        </div>

        <div
          className="w-[260px] shrink-0 bg-card border border-border rounded shadow-sm flex flex-col sticky top-0 self-start"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          <PreferenceCart
            cart={cart}
            rooms={rooms}
            onRemove={remove}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
            isLeader={isLeader || !isLiveMode}
            MAX_PREFERENCES={MAX_PREFERENCES}
          />
          <SubmissionPanel 
            cart={cart} 
            isLeader={isLeader || !isLiveMode} 
            onSubmit={handleSubmit} 
            customLabel={isLiveMode ? 'SUBMIT PREFERENCES' : 'SAVE DRAFT ONLY'}
          />
        </div>
      </div>
    </div>
  );
}
