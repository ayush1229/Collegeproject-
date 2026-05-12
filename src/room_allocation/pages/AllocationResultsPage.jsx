import { useState, useEffect } from 'react';
import AllocationLayout from '../layouts/AllocationLayout';
import AllocationResultCard from '../components/results/AllocationResultCard';
import RoommateList from '../components/results/RoommateList';
import LoadingScreen from '../components/shared/LoadingScreen';
import { getFinalAllocation, downloadAllotmentLetter } from '../api/results.api';

export default function AllocationResultsPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinalAllocation().then(setResult).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen label="Fetching your allocation result…" />;

  /* ── STATE B: Rollover ── */
  if (result?.status === 'ROLLOVER') {
    return (
      <AllocationLayout phase="Results" batch="Allocation Complete">
        <div className="max-w-2xl mx-auto flex flex-col gap-5 pt-4">
          <div className="bg-card border border-border rounded shadow-sm px-6 py-10 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 text-2xl">↩</div>
            <div>
              <h1 className="text-[20px] font-black text-text-primary mb-1.5">No Room Available</h1>
              <p className="text-[13px] text-text-secondary leading-relaxed max-w-sm">
                No valid room was available in your batch. You have been granted rollover protection and will be prioritised in the next batch.
              </p>
            </div>
          </div>
        </div>
      </AllocationLayout>
    );
  }

  /* ── STATE A: Successful allocation ── */
  return (
    <AllocationLayout phase="Results" batch="Allocation Complete">
      <div className="max-w-3xl mx-auto flex flex-col gap-5 pt-4">
        <AllocationResultCard result={result} />

        <div className="grid grid-cols-[1fr_260px] gap-5 items-start">
          <RoommateList roommates={result.roommates} />

          <div className="flex flex-col gap-4">
            {/* Move-in window */}
            <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-[10.5px] font-bold tracking-[0.1em] text-crimson">MOVE-IN SCHEDULE</p>
              </div>
              <div className="px-4 py-4 flex flex-col gap-2">
                {[['Window Opens', 'May 15, 2026'], ['Window Closes', 'May 20, 2026'], ['Physical Block', `Block ${result.room.block} Hostel`]].map(([l,v]) => (
                  <div key={l}>
                    <p className="text-[10px] font-bold tracking-[0.08em] text-text-muted">{l}</p>
                    <p className="text-[13px] font-bold text-text-primary">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => downloadAllotmentLetter()}
              className="w-full py-3 bg-crimson text-white text-[12px] font-black tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors border-0 cursor-pointer"
            >
              DOWNLOAD ALLOTMENT LETTER
            </button>
          </div>
        </div>
      </div>
    </AllocationLayout>
  );
}
