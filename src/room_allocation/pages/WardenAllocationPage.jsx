import { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { allocationSocket, WS_EVENTS } from '../sockets/allocation.socket.js';
import { apiFetch } from '../../utils/api';

/* ── Icons ────────────────────────────────────────────────── */
const GridIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>;
const LayoutIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>;
const UserIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 14c0-2.761 1.791-5 4-5s4 2.239 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;

/* ── Shared Styles ────────────────────────────────────────────── */
const navBase = 'flex items-center gap-2.5 px-2.5 py-[9px] rounded text-[11px] font-semibold tracking-[0.06em] w-full text-left transition-colors duration-150 border-0 cursor-pointer no-underline';
const navActive = 'bg-crimson text-white';
const navIdle = 'text-text-secondary bg-transparent hover:bg-canvas hover:text-text-primary';

export default function WardenAllocationPage() {
  // Real Data State
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [unallocatedStudents, setUnallocatedStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Fetch Hostels on Mount
  useEffect(() => {
    async function init() {
      try {
        const data = await apiFetch(`/api/hostels`);
        const loadedHostels = data.hostels || [];
        setHostels(loadedHostels);
        if (loadedHostels.length > 0) {
          const savedHostel = localStorage.getItem('activeWardenHostel');
          if (savedHostel && loadedHostels.find(h => h.id === savedHostel)) {
            setSelectedHostel(savedHostel);
          } else {
            setSelectedHostel(loadedHostels[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch hostels:", err);
      }
    }
    init();

    // Init Pusher Socket
    allocationSocket.connect();
    return () => allocationSocket.disconnect();
  }, []);

  const fetchHostelData = async (hostelId) => {
    if (!hostelId) return;
    try {
      // 1. Fetch Analytics
      const analyticsData = await apiFetch(`/api/warden/analytics/${hostelId}`);
      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }

      // 2. Fetch Room Grid
      const roomsData = await apiFetch(`/api/allocation/rooms/${hostelId}`);
      setRooms(roomsData.rooms || roomsData || []);

      // 3. Fetch Unallocated Students array
      const unallocatedData = await apiFetch(`/api/warden/unallocated/${hostelId}`);
      setUnallocatedStudents(unallocatedData.students || []);

    } catch (err) {
      console.error("Failed to fetch hostel data:", err);
    }
  };

  // Fetch Data & Join Socket when Hostel changes
  useEffect(() => {
    if (selectedHostel) {
      localStorage.setItem('activeWardenHostel', selectedHostel);
      allocationSocket.joinHostel(selectedHostel);
      fetchHostelData(selectedHostel);

      // Listen for Pusher Updates
      const cleanup = allocationSocket.on(WS_EVENTS.ROOM_MAP_UPDATED, () => {
        // Silently refresh data without full page reload
        fetchHostelData(selectedHostel);
      });

      return cleanup;
    }
  }, [selectedHostel]);

  const handleRollback = async () => {
    if (!selectedHostel) return;
    if (!window.confirm("Are you sure you want to rollback ALL allocations for this hostel? This will detach all students from rooms.")) return;
    
    try {
      const roomIds = rooms.filter(r => r.occupancy > 0).map(r => r.id);
      if (roomIds.length === 0) return;

      const res = await apiFetch(`/api/warden/rollback`, {
        method: 'POST',
        body: JSON.stringify({ hostelId: selectedHostel, roomIds })
      });
      if (res.success) {
        setNotifications([{ type: 'success', message: res.message }, ...notifications]);
      }
    } catch (err) {
      setNotifications([{ type: 'error', message: err.message }, ...notifications]);
    }
  };

  const NAV_ITEMS = [
    { label: 'Overview', to: 'overview', Icon: GridIcon },
    { label: 'Layout Builder', to: 'layout-builder', Icon: LayoutIcon },
    { label: 'Room Grid', to: 'room-grid', Icon: GridIcon },
    { label: 'Remaining', to: 'remaining', Icon: UserIcon },
  ];

  const currentOccupied = rooms.reduce((sum, r) => sum + r.occupancy, 0);
  const isOverview = location.pathname.includes('/overview');

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* ── Top Nav ────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 md:px-8 h-[52px] bg-card border-b border-border sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden flex items-center justify-center p-1.5 -ml-1.5 text-text-secondary hover:bg-canvas rounded border-0 bg-transparent cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="text-[13px] font-black tracking-[0.05em] text-crimson whitespace-nowrap shrink-0 hidden sm:block">
            ADMIN DASHBOARD
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleRollback} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded text-[11px] font-bold cursor-pointer hover:bg-red-100 transition-colors">
            ROLLBACK ALLOCATION
          </button>
          <Link to="/" className="text-[11px] font-bold text-text-muted no-underline hover:text-text-primary">
            EXIT
          </Link>
        </div>
      </header>

      {/* ── Main Layout ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* ── Sidebar ─────────────────────────────────────────── */}
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <aside className={`
          absolute md:relative z-50 md:z-0
          w-[200px] shrink-0 bg-card border-r border-border flex flex-col h-[calc(100vh-52px)] overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="px-4 pt-5 pb-4 border-b border-border">
            <div className="w-[52px] h-[52px] rounded bg-[#eeeeec] border border-border-dark flex items-center justify-center text-text-muted mb-2.5 text-[20px]">
              👨‍⚖️
            </div>
            <p className="text-[13px] font-bold text-text-primary leading-tight">Warden Portal</p>
            <p className="text-[11px] text-text-muted mt-0.5 text-ellipsis overflow-hidden whitespace-nowrap">
              {hostels.find(h => h.id === selectedHostel)?.name || 'Loading...'}
            </p>
          </div>

          <nav className="flex flex-col gap-0.5 p-2.5 flex-1">
            {NAV_ITEMS.map(({ label, to, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `${navBase} ${isActive ? navActive : navIdle}`}
              >
                <span className="shrink-0"><Icon /></span>
                {label.toUpperCase()}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* ── Content Area ────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 pt-5 pb-8">
            {notifications.length > 0 && (
              <div className="mb-5 space-y-2">
                {notifications.slice(0, 3).map((notif, idx) => (
                  <div key={idx} className={`border rounded px-4 py-3 flex justify-between items-center ${
                    notif.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-green-50 border-green-200 text-green-900'
                  }`}>
                    <p className="text-[12px]">{notif.message}</p>
                    <button
                      onClick={() => setNotifications(notifications.filter((_, i) => i !== idx))}
                      className="cursor-pointer border-0 bg-transparent text-[16px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <label className="text-[12px] font-bold text-text-primary mr-3">ACTIVE HOSTEL:</label>
              <select
                value={selectedHostel}
                onChange={(e) => setSelectedHostel(e.target.value)}
                className="px-3 py-1.5 bg-white border border-border rounded text-[12px] text-text-primary cursor-pointer max-w-xs"
              >
                {hostels.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <Outlet context={{
              hostels, selectedHostel, setSelectedHostel,
              analytics, rooms, unallocatedStudents,
              notifications, setNotifications,
              refreshData: () => fetchHostelData(selectedHostel)
            }} />
            
          </div>
        </main>
      </div>
    </div>
  );
}
