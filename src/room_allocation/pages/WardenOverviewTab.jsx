import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import StudentImportModal from '../components/admin/StudentImportModal';

export default function WardenOverviewTab() {
  const { 
    analytics, 
    rooms, 
    hostels, 
    selectedHostel 
  } = useOutletContext();
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const totalStudents = analytics?.studentPool?.reduce((sum, group) => sum + group.count, 0) || 0;
  const totalEmptyRooms = analytics?.availableRooms?.reduce((sum, group) => sum + group.count, 0) || 0;
  const totalRooms = rooms?.length || 0;
  const currentOccupied = rooms?.reduce((sum, r) => sum + r.occupancy, 0) || 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[24px] font-black text-text-primary">Allocation Dashboard</h1>
        <button 
          onClick={() => setIsImportModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-bold shadow-sm transition-colors"
        >
          Import CSV
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded shadow-sm px-5 py-5">
          <p className="text-[11px] font-bold text-text-muted tracking-[0.08em]">UNALLOCATED (1ST YR)</p>
          <p className="text-[28px] font-black text-amber-600 mt-2">{totalStudents}</p>
        </div>
        <div className="bg-card border border-border rounded shadow-sm px-5 py-5">
          <p className="text-[11px] font-bold text-text-muted tracking-[0.08em]">OCCUPIED BEDS</p>
          <p className="text-[28px] font-black text-green-600 mt-2">{currentOccupied}</p>
        </div>
        <div className="bg-card border border-border rounded shadow-sm px-5 py-5">
          <p className="text-[11px] font-bold text-text-muted tracking-[0.08em]">TOTAL ROOMS</p>
          <p className="text-[28px] font-black text-text-primary mt-2">{totalRooms}</p>
        </div>
        <div className="bg-card border border-border rounded shadow-sm px-5 py-5">
          <p className="text-[11px] font-bold text-text-muted tracking-[0.08em]">EMPTY ROOMS</p>
          <p className="text-[28px] font-black text-crimson mt-2">{totalEmptyRooms}</p>
        </div>
      </div>
      
      {/* Breakdown view of student pool */}
      <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
        <h2 className="text-[16px] font-bold text-text-primary mb-4">Unassigned Student Pool Breakdown</h2>
        {analytics?.studentPool?.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {analytics.studentPool.map((group, i) => (
              <div key={i} className="flex justify-between p-3 border border-border rounded bg-canvas">
                <span className="text-[12px] font-bold">{group.state} • {group.branch}</span>
                <span className="text-[14px] text-crimson font-black">{group.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-text-secondary">No unallocated students found.</p>
        )}
      </div>

      <StudentImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        hostels={hostels}
        activeHostelId={selectedHostel}
      />
    </div>
  );
}
