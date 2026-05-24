import { useState } from 'react';
import { NavLink } from 'react-router-dom';

/* ── Mock Data ────────────────────────────────────────────── */
const MOCK_STUDENTS = [
  { id: 'S001', name: 'Aarav Kumar', rollNumber: 'BT001', branch: 'CSE', state: 'Karnataka', allocated: false },
  { id: 'S002', name: 'Bhavna Singh', rollNumber: 'BT002', branch: 'CSE', state: 'Delhi', allocated: false },
  { id: 'S003', name: 'Chirag Patel', rollNumber: 'BT003', branch: 'ECE', state: 'Gujarat', allocated: false },
  { id: 'S004', name: 'Divya Sharma', rollNumber: 'BT004', branch: 'ECE', state: 'Maharashtra', allocated: false },
  { id: 'S005', name: 'Esha Desai', rollNumber: 'BT005', branch: 'CSE', state: 'Karnataka', allocated: false },
  { id: 'S006', name: 'Faisal Khan', rollNumber: 'BT006', branch: 'MECH', state: 'Rajasthan', allocated: false },
  { id: 'S007', name: 'Gita Nair', rollNumber: 'BT007', branch: 'CSE', state: 'Kerala', allocated: false },
  { id: 'S008', name: 'Harsh Verma', rollNumber: 'BT008', branch: 'ECE', state: 'Uttar Pradesh', allocated: false },
  { id: 'S009', name: 'Ishita Gupta', rollNumber: 'BT009', branch: 'MECH', state: 'Delhi', allocated: true },
  { id: 'S010', name: 'Jatin Rawat', rollNumber: 'BT010', branch: 'CSE', state: 'Himachal Pradesh', allocated: false },
];

const MOCK_ROOMS = [
  { id: 'R101', block: 'A', number: '101', capacity: 2, occupied: 1, students: ['S009'] },
  { id: 'R102', block: 'A', number: '102', capacity: 2, occupied: 0, students: [] },
  { id: 'R103', block: 'A', number: '103', capacity: 2, occupied: 0, students: [] },
  { id: 'R201', block: 'B', number: '201', capacity: 2, occupied: 0, students: [] },
  { id: 'R202', block: 'B', number: '202', capacity: 2, occupied: 0, students: [] },
  { id: 'R301', block: 'C', number: '301', capacity: 2, occupied: 0, students: [] },
];

/* ── Icons ────────────────────────────────────────────────── */
const GridIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>;
const DiceIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/><circle cx="5" cy="5" r="1.5" fill="currentColor"/><circle cx="11" cy="11" r="1.5" fill="currentColor"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>;
const UserIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 14c0-2.761 1.791-5 4-5s4 2.239 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const LayoutIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>;
const ClockIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

/* ── Shared Styles ────────────────────────────────────────────── */
const navBase = 'flex items-center gap-2.5 px-2.5 py-[9px] rounded text-[11px] font-semibold tracking-[0.06em] w-full text-left transition-colors duration-150 border-0 cursor-pointer no-underline';
const navActive = 'bg-crimson text-white';
const navIdle = 'text-text-secondary bg-transparent hover:bg-canvas hover:text-text-primary';

/* ── Components ────────────────────────────────────────────── */

function RandomAllocationMode({ onConfirm }) {
  const [preview, setPreview] = useState(null);

  const handleRunPreview = () => {
    const unallocated = MOCK_STUDENTS.filter(s => !s.allocated);
    const available = MOCK_ROOMS.filter(r => r.occupied < r.capacity);
    setPreview({
      studentsToAllocate: unallocated.length,
      availableRooms: available.length,
      allocation: unallocated.map((student, idx) => ({
        student: student.name,
        room: available[idx % available.length]?.number || 'N/A',
        block: available[idx % available.length]?.block || 'N/A',
      })).slice(0, Math.min(unallocated.length, available.length)),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
        <h3 className="text-[14px] font-bold text-text-primary mb-4">Random Allocation Preview</h3>
        <button
          onClick={handleRunPreview}
          className="px-4 py-2.5 bg-crimson text-white text-[12px] font-bold tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors border-0 cursor-pointer"
        >
          RUN RANDOM ALLOCATION
        </button>
      </div>

      {preview && (
        <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
          <div className="mb-5">
            <p className="text-[13px] font-bold text-text-primary mb-1">Allocation Summary</p>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="bg-canvas rounded p-3">
                <p className="text-[11px] text-text-secondary font-medium">Students to Allocate</p>
                <p className="text-[22px] font-bold text-crimson mt-1">{preview.studentsToAllocate}</p>
              </div>
              <div className="bg-canvas rounded p-3">
                <p className="text-[11px] text-text-secondary font-medium">Available Rooms</p>
                <p className="text-[22px] font-bold text-crimson mt-1">{preview.availableRooms}</p>
              </div>
              <div className="bg-canvas rounded p-3">
                <p className="text-[11px] text-text-secondary font-medium">Will Allocate</p>
                <p className="text-[22px] font-bold text-crimson mt-1">{preview.allocation.length}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 max-h-[300px] overflow-y-auto">
            <p className="text-[11px] font-bold text-text-muted mb-3 tracking-[0.08em]">PREVIEW</p>
            <div className="space-y-2">
              {preview.allocation.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[12px] py-2 px-3 bg-canvas rounded">
                  <span className="text-text-primary font-medium">{item.student}</span>
                  <span className="text-text-secondary">Block {item.block}-{item.room}</span>
                </div>
              ))}
              {preview.allocation.length > 6 && (
                <p className="text-[11px] text-text-muted text-center py-2">+{preview.allocation.length - 6} more...</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => onConfirm(preview)}
              className="flex-1 px-4 py-3 bg-crimson text-white text-[12px] font-bold tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors border-0 cursor-pointer"
            >
              CONFIRM & ALLOCATE
            </button>
            <button
              onClick={() => setPreview(null)}
              className="flex-1 px-4 py-3 bg-canvas border border-border text-text-primary text-[12px] font-bold tracking-[0.06em] rounded hover:bg-card transition-colors border-0 cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ManualAllocationMode({ onAllocate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const filteredStudents = MOCK_STUDENTS.filter(s =>
    !s.allocated && (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNumber.includes(searchQuery))
  );

  const availableRooms = MOCK_ROOMS.filter(r => r.occupied < r.capacity);

  const handleAssign = () => {
    if (selectedStudent && selectedRoom) {
      onAllocate({ student: selectedStudent, room: selectedRoom });
      setSelectedStudent(null);
      setSelectedRoom(null);
      setSearchQuery('');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-5">
      {/* Student Selection */}
      <div className="bg-card border border-border rounded shadow-sm px-5 py-4">
        <h3 className="text-[13px] font-bold text-text-primary mb-3">Select Student</h3>
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-canvas border border-border rounded text-[12px] text-text-primary placeholder-text-muted focus:outline-none focus:border-crimson mb-3"
        />
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {filteredStudents.map(student => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`w-full text-left px-3 py-2 rounded text-[12px] transition-colors border-0 cursor-pointer ${
                selectedStudent?.id === student.id
                  ? 'bg-crimson text-white font-medium'
                  : 'bg-canvas border border-border text-text-primary hover:bg-card'
              }`}
            >
              <div className="font-medium">{student.name}</div>
              <div className="text-[11px] opacity-75">{student.rollNumber} • {student.branch}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Room Selection */}
      <div className="bg-card border border-border rounded shadow-sm px-5 py-4">
        <h3 className="text-[13px] font-bold text-text-primary mb-3">Select Room</h3>
        <div className="space-y-2 max-h-[360px] overflow-y-auto">
          {availableRooms.map(room => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full text-left px-3 py-2 rounded text-[12px] transition-colors border-0 cursor-pointer ${
                selectedRoom?.id === room.id
                  ? 'bg-crimson text-white font-medium'
                  : 'bg-canvas border border-border text-text-primary hover:bg-card'
              }`}
            >
              <div className="font-medium">Block {room.block} - Room {room.number}</div>
              <div className="text-[11px] opacity-75">{room.occupied}/{room.capacity} occupied</div>
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Section */}
      <div className="col-span-2">
        <button
          onClick={handleAssign}
          disabled={!selectedStudent || !selectedRoom}
          className={`w-full px-4 py-3 text-[12px] font-bold tracking-[0.06em] rounded transition-colors border-0 cursor-pointer ${
            selectedStudent && selectedRoom
              ? 'bg-crimson text-white hover:bg-crimson-dark'
              : 'bg-canvas border border-border text-text-muted cursor-not-allowed'
          }`}
        >
          ASSIGN ROOM
        </button>
      </div>
    </div>
  );
}

function LayoutBasedAllocationMode({ onAllocate }) {
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [preview, setPreview] = useState(null);

  const layouts = [
    { id: 'branch', label: 'Branch-wise', desc: 'Group students by their branch' },
    { id: 'state', label: 'Home State-wise', desc: 'Group students from same state' },
    { id: 'mixed', label: 'Mixed', desc: 'Mix students from different backgrounds' },
  ];

  const handleLayoutSelect = (layoutId) => {
    setSelectedLayout(layoutId);
    const unallocated = MOCK_STUDENTS.filter(s => !s.allocated);
    const available = MOCK_ROOMS.filter(r => r.occupied < r.capacity);

    const allocation = unallocated.map((student, idx) => ({
      student,
      room: available[idx % available.length],
    })).slice(0, Math.min(unallocated.length, available.length));

    setPreview({
      layout: layouts.find(l => l.id === layoutId).label,
      allocation,
      remaining: unallocated.length - allocation.length,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Layout Selection */}
      <div className="grid grid-cols-3 gap-4">
        {layouts.map(layout => (
          <button
            key={layout.id}
            onClick={() => handleLayoutSelect(layout.id)}
            className={`px-4 py-4 rounded border-2 transition-colors border-0 cursor-pointer text-left ${
              selectedLayout === layout.id
                ? 'bg-crimson text-white border-crimson'
                : 'bg-card border-border text-text-primary hover:border-crimson'
            }`}
          >
            <p className="text-[13px] font-bold mb-1">{layout.label}</p>
            <p className="text-[11px] opacity-75">{layout.desc}</p>
          </button>
        ))}
      </div>

      {/* Preview & Controls */}
      {preview && (
        <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
          <h3 className="text-[14px] font-bold text-text-primary mb-4">Allocation Preview: {preview.layout}</h3>

          <div className="max-h-[300px] overflow-y-auto bg-canvas rounded p-4 mb-4 space-y-2">
            {preview.allocation.slice(0, 8).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[12px] py-2 px-3 bg-card rounded border border-border">
                <div>
                  <p className="text-text-primary font-medium">{item.student.name}</p>
                  <p className="text-text-secondary text-[11px]">{item.student.branch} • {item.student.state}</p>
                </div>
                <span className="text-crimson font-semibold">Block {item.room.block}-{item.room.number}</span>
              </div>
            ))}
            {preview.allocation.length > 8 && (
              <p className="text-[11px] text-text-muted text-center py-2">+{preview.allocation.length - 8} more...</p>
            )}
          </div>

          {preview.remaining > 0 && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded">
              <p className="text-[12px] text-amber-900 font-medium">{preview.remaining} students remaining unallocated</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onAllocate(preview)}
              className="flex-1 px-4 py-3 bg-crimson text-white text-[12px] font-bold tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors border-0 cursor-pointer"
            >
              RUN ALLOCATION
            </button>
            <button
              onClick={() => setPreview(null)}
              className="flex-1 px-4 py-3 bg-canvas border border-border text-text-primary text-[12px] font-bold tracking-[0.06em] rounded hover:bg-card transition-colors border-0 cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RemainingStudentsSection() {
  const unallocated = MOCK_STUDENTS.filter(s => !s.allocated);

  if (unallocated.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded shadow-sm px-6 py-5 mt-6">
      <h3 className="text-[14px] font-bold text-text-primary mb-4">Remaining Unallocated Students: {unallocated.length}</h3>
      <div className="space-y-2 max-h-[250px] overflow-y-auto mb-4">
        {unallocated.slice(0, 10).map(student => (
          <div key={student.id} className="flex justify-between items-center text-[12px] py-2 px-3 bg-canvas rounded border border-border">
            <div>
              <p className="text-text-primary font-medium">{student.name}</p>
              <p className="text-text-secondary text-[11px]">{student.rollNumber} • {student.branch}</p>
            </div>
            <span className="text-[11px] text-text-muted">{student.state}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-2.5 bg-crimson text-white text-[12px] font-bold tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors border-0 cursor-pointer">
          ALLOCATE RANDOMLY
        </button>
        <button className="flex-1 px-4 py-2.5 bg-canvas border border-border text-text-primary text-[12px] font-bold tracking-[0.06em] rounded hover:bg-card transition-colors border-0 cursor-pointer">
          USE DIFFERENT LAYOUT
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function WardenAllocationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  const handleRandomAllocationConfirm = (preview) => {
    setNotifications([...notifications, { type: 'success', message: `Allocated ${preview.allocation.length} students!` }]);
  };

  const handleManualAllocate = (allocation) => {
    setNotifications([...notifications, { type: 'success', message: `${allocation.student.name} assigned to Block ${allocation.room.block}-${allocation.room.number}` }]);
  };

  const handleLayoutAllocate = (preview) => {
    setNotifications([...notifications, { type: 'success', message: `Allocated ${preview.allocation.length} students using ${preview.layout} layout!` }]);
  };

  const NAV_ITEMS = [
    { label: 'Overview', id: 'overview', Icon: GridIcon },
    { label: 'Random', id: 'random', Icon: DiceIcon },
    { label: 'Manual', id: 'manual', Icon: UserIcon },
    { label: 'Layout-Based', id: 'layout', Icon: LayoutIcon },
    { label: 'History', id: 'history', Icon: ClockIcon },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* ── Top Nav ────────────────────────────────────────────── */}
      <header className="flex items-center gap-10 px-8 h-[52px] bg-card border-b border-border sticky top-0 z-50 shrink-0">
        <div className="text-[13px] font-black tracking-[0.05em] text-crimson whitespace-nowrap shrink-0">
          FIRST YEAR ROOM ALLOCATION
        </div>
        <nav className="flex gap-7 flex-1">
          <span className="text-xs font-medium tracking-[0.02em] pb-[3px] border-b-2 border-transparent text-text-secondary">Warden Portal</span>
        </nav>
      </header>

      {/* ── Main Layout ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="w-[200px] shrink-0 bg-card border-r border-border flex flex-col sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
          {/* Profile Section */}
          <div className="px-4 pt-5 pb-4 border-b border-border">
            <div className="w-[52px] h-[52px] rounded bg-[#eeeeec] border border-border-dark flex items-center justify-center text-text-muted mb-2.5 text-[20px]">
              👨‍⚖️
            </div>
            <p className="text-[13px] font-bold text-text-primary leading-tight">Warden Portal</p>
            <p className="text-[11px] text-text-muted mt-0.5">Hostel A</p>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-0.5 p-2.5 flex-1">
            {NAV_ITEMS.map(({ label, id, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`${navBase} ${activeTab === id ? navActive : navIdle}`}
              >
                <span className="shrink-0"><Icon /></span>
                {label.toUpperCase()}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Content Area ────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 pt-5 pb-8">
            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="mb-5 space-y-2">
                {notifications.slice(-3).map((notif, idx) => (
                  <div key={idx} className="bg-green-50 border border-green-200 rounded px-4 py-3 flex justify-between items-center">
                    <p className="text-[12px] text-green-900">{notif.message}</p>
                    <button
                      onClick={() => setNotifications(notifications.filter((_, i) => i !== idx))}
                      className="text-green-600 cursor-pointer border-0 bg-transparent text-[16px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-5">
                <h1 className="text-[24px] font-black text-text-primary">Allocation Dashboard</h1>

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded shadow-sm px-5 py-5">
                    <p className="text-[11px] font-bold text-text-muted tracking-[0.08em]">TOTAL STUDENTS</p>
                    <p className="text-[28px] font-black text-text-primary mt-2">{MOCK_STUDENTS.length}</p>
                  </div>
                  <div className="bg-card border border-border rounded shadow-sm px-5 py-5">
                    <p className="text-[11px] font-bold text-text-muted tracking-[0.08em]">ALLOCATED</p>
                    <p className="text-[28px] font-black text-green-600 mt-2">{MOCK_STUDENTS.filter(s => s.allocated).length}</p>
                  </div>
                  <div className="bg-card border border-border rounded shadow-sm px-5 py-5">
                    <p className="text-[11px] font-bold text-text-muted tracking-[0.08em]">UNALLOCATED</p>
                    <p className="text-[28px] font-black text-amber-600 mt-2">{MOCK_STUDENTS.filter(s => !s.allocated).length}</p>
                  </div>
                  <div className="bg-card border border-border rounded shadow-sm px-5 py-5">
                    <p className="text-[11px] font-bold text-text-muted tracking-[0.08em]">ROOMS AVAILABLE</p>
                    <p className="text-[28px] font-black text-crimson mt-2">{MOCK_ROOMS.filter(r => r.occupied < r.capacity).length}</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
                  <h2 className="text-[16px] font-bold text-text-primary mb-4">Getting Started</h2>
                  <div className="space-y-3">
                    <p className="text-[13px] text-text-secondary">Choose an allocation method from the sidebar:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="text-[12px] text-text-secondary">• <strong>Random:</strong> Automatically allocate students to available rooms</li>
                      <li className="text-[12px] text-text-secondary">• <strong>Manual:</strong> Individually assign students to specific rooms</li>
                      <li className="text-[12px] text-text-secondary">• <strong>Layout-Based:</strong> Allocate by branch, state, or mix preferences</li>
                      <li className="text-[12px] text-text-secondary">• <strong>History:</strong> View past allocation records</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Random Allocation Tab */}
            {activeTab === 'random' && (
              <div>
                <h1 className="text-[24px] font-black text-text-primary mb-5">Random Allocation</h1>
                <RandomAllocationMode onConfirm={handleRandomAllocationConfirm} />
              </div>
            )}

            {/* Manual Allocation Tab */}
            {activeTab === 'manual' && (
              <div>
                <h1 className="text-[24px] font-black text-text-primary mb-5">Manual Allocation</h1>
                <ManualAllocationMode onAllocate={handleManualAllocate} />
                <RemainingStudentsSection />
              </div>
            )}

            {/* Layout-Based Allocation Tab */}
            {activeTab === 'layout' && (
              <div>
                <h1 className="text-[24px] font-black text-text-primary mb-5">Layout-Based Allocation</h1>
                <LayoutBasedAllocationMode onAllocate={handleLayoutAllocate} />
                <RemainingStudentsSection />
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <h1 className="text-[24px] font-black text-text-primary mb-5">Allocation History</h1>
                <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
                  <p className="text-[12px] text-text-secondary">No allocation history available yet.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
