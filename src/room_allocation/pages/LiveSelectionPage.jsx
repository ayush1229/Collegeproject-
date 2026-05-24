import { useNavigate } from 'react-router-dom';
import AllocationLayout from '../layouts/AllocationLayout';
import LiveRoundTimer from '../components/live_selection/LiveRoundTimer';
import PreferenceBuilder from '../components/live_selection/PreferenceBuilder';
import { useAllocationState } from '../hooks/useAllocationState';

export default function LiveSelectionPage() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const studentId = user ? user.id : null;

  const { state: allocationState } = useAllocationState(studentId);
  const isLeader = allocationState?.isLeader ?? false;

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <LiveRoundTimer round={allocationState?.roundNumber ?? 1} initialSeconds={1112} isLeader={isLeader} />

      <AllocationLayout
        phase="Live Selection"
        batch={`Batch #${allocationState?.batchNumber ?? 'TBD'} - Round ${allocationState?.roundNumber ?? 1}`}
        hostelId={allocationState?.hostelId}
      >
        <div className="flex flex-col gap-4 min-h-full pb-8">
          <PreferenceBuilder 
            studentId={studentId} 
            allocationState={allocationState} 
            isLiveMode={true} 
          />
        </div>
      </AllocationLayout>
    </div>
  );
}
