import { useState } from 'react';

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

const MOCK_ROOMS_A = [
  { id: 'R101', hostel: 'A', number: '101', type: '2-Seater', capacity: 2, occupied: 1, students: ['S009'] },
  { id: 'R102', hostel: 'A', number: '102', type: '2-Seater', capacity: 2, occupied: 0, students: [] },
  { id: 'R103', hostel: 'A', number: '103', type: '3-Seater', capacity: 3, occupied: 0, students: [] },
];

const MOCK_ROOMS_B = [
  { id: 'R201', hostel: 'B', number: '201', type: '3-Seater', capacity: 3, occupied: 0, students: [] },
  { id: 'R202', hostel: 'B', number: '202', type: '4-Seater', capacity: 4, occupied: 0, students: [] },
];


/* ── Icons ────────────────────────────────────────────────── */
const GridIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>;
const LayoutIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>;
const UserIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 14c0-2.761 1.791-5 4-5s4 2.239 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const ClockIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DiceIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/><circle cx="5" cy="5" r="1.5" fill="currentColor"/><circle cx="11" cy="11" r="1.5" fill="currentColor"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>;

/* ── Shared Styles ────────────────────────────────────────────── */
const navBase = 'flex items-center gap-2.5 px-2.5 py-[9px] rounded text-[11px] font-semibold tracking-[0.06em] w-full text-left transition-colors duration-150 border-0 cursor-pointer no-underline';
const navActive = 'bg-crimson text-white';
const navIdle = 'text-text-secondary bg-transparent hover:bg-canvas hover:text-text-primary';

const STUDENT_CATEGORIES = ['CSE Branch', 'ECE Branch', 'Home State', 'Other State', 'Any/Random'];

/* ── Layout Builder Component ────────────────────────────────────────────── */
function LayoutBuilder({ notifications, setNotifications }) {
  const [selectedHostel, setSelectedHostel] = useState('A');
  const [layoutConfig, setLayoutConfig] = useState({
    '2-Seater': ['CSE Branch', 'CSE Branch'],
    '3-Seater': ['ECE Branch', 'Home State', 'Any/Random'],
    '4-Seater': ['Mechanical', 'CSE Branch', 'Home State', 'Any/Random'],
  });
  const [selectedRoomType, setSelectedRoomType] = useState('2-Seater');

  const roomTypes = ['2-Seater', '3-Seater', '4-Seater'];
  const getSlotCount = (type) => parseInt(type.split('-')[0]);

  const handleSlotChange = (slotIndex, value) => {
    const newConfig = [...layoutConfig[selectedRoomType]];
    newConfig[slotIndex] = value;
    setLayoutConfig({
      ...layoutConfig,
      [selectedRoomType]: newConfig,
    });
  };

  const handleApplyLayout = () => {
    setNotifications([...notifications, {
      type: 'success',
      message: `Layout applied to all ${selectedRoomType} rooms in Hostel ${selectedHostel}`,
    }]);
  };

  const handleRunAllocation = () => {
    setNotifications([...notifications, {
      type: 'success',
      message: `Running layout allocation for Hostel ${selectedHostel}...`,
    }]);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Hostel & Room Type Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded shadow-sm px-5 py-4">
          <label className="text-[12px] font-bold text-text-primary mb-3 block">SELECT HOSTEL</label>
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="w-full px-3 py-2 bg-canvas border border-border rounded text-[12px] text-text-primary cursor-pointer"
          >
            <option value="A">Hostel A</option>
            <option value="B">Hostel B</option>
          </select>
        </div>

        <div className="bg-card border border-border rounded shadow-sm px-5 py-4">
          <label className="text-[12px] font-bold text-text-primary mb-3 block">SELECT ROOM TYPE</label>
          <select
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="w-full px-3 py-2 bg-canvas border border-border rounded text-[12px] text-text-primary cursor-pointer"
          >
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Layout Builder */}
      <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
        <h3 className="text-[14px] font-bold text-text-primary mb-6">Define Layout Pattern - {selectedRoomType}</h3>
        
        <div className="flex gap-4 justify-center mb-6">
          {layoutConfig[selectedRoomType].map((category, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-20 h-20 border-2 border-border rounded bg-canvas flex items-center justify-center mb-3 text-[32px]">
                🛏️
              </div>
              <label className="text-[11px] font-bold text-text-secondary mb-2 block">SLOT {idx + 1}</label>
              <select
                value={category}
                onChange={(e) => handleSlotChange(idx, e.target.value)}
                className="px-2 py-1.5 bg-canvas border border-border rounded text-[11px] text-text-primary cursor-pointer"
              >
                {STUDENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleApplyLayout}
            className="flex-1 px-4 py-2.5 bg-canvas border border-border text-text-primary text-[12px] font-bold tracking-[0.06em] rounded hover:bg-card transition-colors cursor-pointer"
          >
            APPLY LAYOUT TO ALL
          </button>
          <button
            onClick={handleRunAllocation}
            className="flex-1 px-4 py-2.5 bg-crimson text-white text-[12px] font-bold tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors cursor-pointer"
          >
            RUN LAYOUT ALLOCATION
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Room Grid Component ────────────────────────────────────────────── */
function RoomGrid({ notifications, setNotifications }) {
  const [selectedHostel, setSelectedHostel] = useState('A');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getRoomsForHostel = (hostel) => hostel === 'A' ? MOCK_ROOMS_A : MOCK_ROOMS_B;
  const rooms = getRoomsForHostel(selectedHostel);
  
  const filteredStudents = MOCK_STUDENTS.filter(s =>
    !s.allocated && (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNumber.includes(searchQuery))
  );

  const handleAssignStudent = (studentName, roomNumber) => {
    setNotifications([...notifications, {
      type: 'success',
      message: `${studentName} assigned to Room ${roomNumber}`,
    }]);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Hostel Selection */}
      <div className="bg-card border border-border rounded shadow-sm px-5 py-4">
        <label className="text-[12px] font-bold text-text-primary mb-3 block">SELECT HOSTEL</label>
        <select
          value={selectedHostel}
          onChange={(e) => setSelectedHostel(e.target.value)}
          className="w-full px-3 py-2 bg-canvas border border-border rounded text-[12px] text-text-primary cursor-pointer"
        >
          <option value="A">Hostel A</option>
          <option value="B">Hostel B</option>
        </select>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {rooms.map(room => (
          <button
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className="text-left p-4 bg-card border border-border rounded shadow-sm hover:border-crimson transition-colors cursor-pointer"
          >
            <p className="text-[13px] font-bold text-text-primary">Room {room.number}</p>
            <p className="text-[11px] text-text-secondary mt-1">{room.type}</p>
            <p className="text-[11px] text-text-secondary mt-0.5">{room.occupied}/{room.capacity} occupied</p>
            <div className="flex gap-1.5 mt-3">
              {Array(room.capacity).fill(0).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded border border-border text-[8px] flex items-center justify-center ${
                    i < room.occupied ? 'bg-green-100 border-green-300 text-green-700' : 'bg-canvas'
                  }`}
                >
                  {i < room.occupied ? '✓' : ''}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-[16px] font-bold text-text-primary">Room {selectedRoom.number}</h3>
                <p className="text-[12px] text-text-secondary mt-1">{selectedRoom.type} • {selectedRoom.occupied}/{selectedRoom.capacity} occupied</p>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-text-muted cursor-pointer border-0 bg-transparent text-[20px] font-bold"
              >
                ✕
              </button>
            </div>

            {/* Bed Slots */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Array(selectedRoom.capacity).fill(0).map((_, idx) => (
                <div key={idx} className="border-2 border-border rounded p-4 bg-canvas">
                  <p className="text-[12px] font-bold text-text-secondary mb-3">BED {idx + 1}</p>
                  <div className="w-full h-16 border-2 border-dashed border-border rounded flex items-center justify-center mb-3 text-[24px]">
                    🛏️
                  </div>
                  {idx < selectedRoom.occupied ? (
                    <p className="text-[11px] text-text-primary font-medium">Assigned</p>
                  ) : (
                    <button
                      onClick={() => setSelectedRoom(null)}
                      className="w-full px-2 py-1.5 bg-crimson text-white text-[11px] font-bold rounded cursor-pointer hover:bg-crimson-dark transition-colors"
                    >
                      ASSIGN
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Student Search */}
            <div className="border-t border-border pt-4">
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-canvas border border-border rounded text-[12px] text-text-primary placeholder-text-muted focus:outline-none focus:border-crimson mb-3"
              />
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {filteredStudents.slice(0, 5).map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleAssignStudent(student.name, selectedRoom.number)}
                    className="w-full text-left px-3 py-2 rounded text-[12px] bg-canvas border border-border text-text-primary hover:bg-card transition-colors cursor-pointer"
                  >
                    <div className="font-medium">{student.name}</div>
                    <div className="text-[11px] text-text-secondary">{student.rollNumber} • {student.branch}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedRoom(null)}
              className="w-full mt-4 px-4 py-2 bg-canvas border border-border text-text-primary text-[12px] font-bold tracking-[0.06em] rounded hover:bg-card transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Random Allocation Component ────────────────────────────────────────────── */
function RandomAllocation({ notifications, setNotifications }) {
  const [preview, setPreview] = useState(null);

  const getAllRooms = () => [...MOCK_ROOMS_A, ...MOCK_ROOMS_B];
  const unallocated = MOCK_STUDENTS.filter(s => !s.allocated);

  const handleRunPreview = () => {
    const available = getAllRooms().filter(r => r.occupied < r.capacity);
    const totalSlots = available.reduce((sum, r) => sum + (r.capacity - r.occupied), 0);
    
    setPreview({
      studentsToAllocate: unallocated.length,
      availableRooms: available.length,
      totalSlots: totalSlots,
      allocation: unallocated.map((student, idx) => ({
        student: student.name,
        room: available[idx % available.length]?.number || 'N/A',
        hostel: available[idx % available.length]?.hostel || 'N/A',
      })).slice(0, Math.min(unallocated.length, totalSlots)),
    });
  };

  const handleConfirmAllocation = () => {
    if (preview) {
      setNotifications([...notifications, {
        type: 'success',
        message: `Successfully allocated ${preview.allocation.length} students!`,
      }]);
      setPreview(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
        <h3 className="text-[14px] font-bold text-text-primary mb-4">Random Allocation</h3>
        <button
          onClick={handleRunPreview}
          className="px-4 py-2.5 bg-crimson text-white text-[12px] font-bold tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors cursor-pointer"
        >
          RUN RANDOM ALLOCATION
        </button>
      </div>

      {preview && (
        <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
          <div className="mb-5">
            <p className="text-[13px] font-bold text-text-primary mb-3">Allocation Preview</p>
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
                  <span className="text-text-secondary">Hostel {item.hostel}-{item.room}</span>
                </div>
              ))}
              {preview.allocation.length > 6 && (
                <p className="text-[11px] text-text-muted text-center py-2">+{preview.allocation.length - 6} more...</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleConfirmAllocation}
              className="flex-1 px-4 py-3 bg-crimson text-white text-[12px] font-bold tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors cursor-pointer"
            >
              CONFIRM & ALLOCATE
            </button>
            <button
              onClick={() => setPreview(null)}
              className="flex-1 px-4 py-3 bg-canvas border border-border text-text-primary text-[12px] font-bold tracking-[0.06em] rounded hover:bg-card transition-colors cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Manual Allocation Component ────────────────────────────────────────────── */
function ManualAllocation({ notifications, setNotifications }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);

  const getAllRooms = () => [...MOCK_ROOMS_A, ...MOCK_ROOMS_B];
  const filteredStudents = MOCK_STUDENTS.filter(s =>
    !s.allocated && (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNumber.includes(searchQuery))
  );
  const availableRooms = getAllRooms().filter(r => r.occupied < r.capacity);

  const handleAssign = () => {
    if (selectedStudent && selectedRoom) {
      const assignment = {
        student: selectedStudent.name,
        room: selectedRoom.number,
        hostel: selectedRoom.hostel,
        timestamp: new Date().toLocaleTimeString(),
      };
      setAssignedStudents([assignment, ...assignedStudents]);
      setNotifications([...notifications, {
        type: 'success',
        message: `${selectedStudent.name} assigned to Hostel ${selectedRoom.hostel}-Room ${selectedRoom.number}`,
      }]);
      setSelectedStudent(null);
      setSelectedRoom(null);
      setSearchQuery('');
    }
  };

  return (
    <div className="flex flex-col gap-5">
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
                className={`w-full text-left px-3 py-2 rounded text-[12px] transition-colors cursor-pointer ${
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
                className={`w-full text-left px-3 py-2 rounded text-[12px] transition-colors cursor-pointer ${
                  selectedRoom?.id === room.id
                    ? 'bg-crimson text-white font-medium'
                    : 'bg-canvas border border-border text-text-primary hover:bg-card'
                }`}
              >
                <div className="font-medium">Hostel {room.hostel} - Room {room.number}</div>
                <div className="text-[11px] opacity-75">{room.type} • {room.occupied}/{room.capacity} occupied</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Button */}
      <button
        onClick={handleAssign}
        disabled={!selectedStudent || !selectedRoom}
        className={`w-full px-4 py-3 text-[12px] font-bold tracking-[0.06em] rounded transition-colors cursor-pointer ${
          selectedStudent && selectedRoom
            ? 'bg-crimson text-white hover:bg-crimson-dark'
            : 'bg-canvas border border-border text-text-muted cursor-not-allowed'
        }`}
      >
        ASSIGN ROOM
      </button>

      {/* Recently Assigned Students */}
      {assignedStudents.length > 0 && (
        <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
          <h3 className="text-[13px] font-bold text-text-primary mb-4">Recently Assigned: {assignedStudents.length}</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {assignedStudents.map((assignment, idx) => (
              <div key={idx} className="flex justify-between items-center text-[12px] py-2 px-3 bg-canvas rounded border border-border">
                <div>
                  <p className="text-text-primary font-medium">{assignment.student}</p>
                  <p className="text-text-secondary text-[11px]">Hostel {assignment.hostel}-Room {assignment.room}</p>
                </div>
                <span className="text-[10px] text-text-muted">{assignment.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function RemainingStudents({ notifications, setNotifications }) {
  const unallocated = MOCK_STUDENTS.filter(s => !s.allocated);

  const handleAllocateRandomly = () => {
    setNotifications([...notifications, {
      type: 'success',
      message: `Allocated ${Math.min(unallocated.length, 3)} students randomly`,
    }]);
  };

  const handleAllocateByLayout = () => {
    setNotifications([...notifications, {
      type: 'success',
      message: `Allocating ${unallocated.length} students using layout pattern`,
    }]);
  };

  if (unallocated.length === 0) {
    return (
      <div className="bg-card border border-border rounded shadow-sm px-6 py-8 text-center">
        <p className="text-[14px] text-text-primary font-bold">All Students Allocated!</p>
        <p className="text-[12px] text-text-secondary mt-2">There are no remaining unallocated students.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
      <h3 className="text-[14px] font-bold text-text-primary mb-4">Unallocated Students: {unallocated.length}</h3>
      <div className="space-y-2 max-h-[350px] overflow-y-auto mb-5">
        {unallocated.map(student => (
          <div key={student.id} className="flex justify-between items-center text-[12px] py-2 px-3 bg-canvas rounded border border-border">
            <div>
              <p className="text-text-primary font-medium">{student.name}</p>
              <p className="text-text-secondary text-[11px]">{student.rollNumber} • {student.branch} • {student.state}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleAllocateRandomly}
          className="flex-1 px-4 py-2.5 bg-crimson text-white text-[12px] font-bold tracking-[0.06em] rounded hover:bg-crimson-dark transition-colors cursor-pointer"
        >
          ALLOCATE REMAINING RANDOMLY
        </button>
        <button
          onClick={handleAllocateByLayout}
          className="flex-1 px-4 py-2.5 bg-canvas border border-border text-text-primary text-[12px] font-bold tracking-[0.06em] rounded hover:bg-card transition-colors cursor-pointer"
        >
          ALLOCATE REMAINING BY LAYOUT
        </button>
      </div>
    </div>
  );
}


/* ── Main Page ────────────────────────────────────────────── */
export default function WardenAllocationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  const NAV_ITEMS = [
    { label: 'Overview', id: 'overview', Icon: GridIcon },
    { label: 'Layout Builder', id: 'layout-builder', Icon: LayoutIcon },
    { label: 'Random', id: 'random', Icon: DiceIcon },
    { label: 'Manual', id: 'manual', Icon: UserIcon },
    { label: 'Room Grid', id: 'room-grid', Icon: GridIcon },
    { label: 'Remaining', id: 'remaining', Icon: UserIcon },
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
                    <p className="text-[11px] font-bold text-text-muted tracking-[0.08em]">TOTAL ROOMS</p>
                    <p className="text-[28px] font-black text-crimson mt-2">{MOCK_ROOMS_A.length + MOCK_ROOMS_B.length}</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded shadow-sm px-6 py-5">
                  <h2 className="text-[16px] font-bold text-text-primary mb-4">Getting Started</h2>
                  <div className="space-y-3">
                    <p className="text-[13px] text-text-secondary">Choose an allocation method from the sidebar:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="text-[12px] text-text-secondary">• <strong>Layout Builder:</strong> Define bed allocation patterns and apply to room types</li>
                      <li className="text-[12px] text-text-secondary">• <strong>Room Grid:</strong> View rooms and manually assign students to specific beds</li>
                      <li className="text-[12px] text-text-secondary">• <strong>Remaining:</strong> Allocate unallocated students randomly or by layout</li>
                      <li className="text-[12px] text-text-secondary">• <strong>History:</strong> View past allocation records</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Layout Builder Tab */}
            {activeTab === 'layout-builder' && (
              <div>
                <h1 className="text-[24px] font-black text-text-primary mb-5">Layout Builder</h1>
                <LayoutBuilder notifications={notifications} setNotifications={setNotifications} />
              </div>
            )}

            {/* Random Allocation Tab */}
            {activeTab === 'random' && (
              <div>
                <h1 className="text-[24px] font-black text-text-primary mb-5">Random Allocation</h1>
                <RandomAllocation notifications={notifications} setNotifications={setNotifications} />
              </div>
            )}

            {/* Manual Allocation Tab */}
            {activeTab === 'manual' && (
              <div>
                <h1 className="text-[24px] font-black text-text-primary mb-5">Manual Allocation</h1>
                <ManualAllocation notifications={notifications} setNotifications={setNotifications} />
              </div>
            )}

            {/* Room Grid Tab */}
            {activeTab === 'room-grid' && (
              <div>
                <h1 className="text-[24px] font-black text-text-primary mb-5">Room Grid</h1>
                <RoomGrid notifications={notifications} setNotifications={setNotifications} />
              </div>
            )}

            {/* Remaining Students Tab */}
            {activeTab === 'remaining' && (
              <div>
                <h1 className="text-[24px] font-black text-text-primary mb-5">Remaining Students</h1>
                <RemainingStudents notifications={notifications} setNotifications={setNotifications} />
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
