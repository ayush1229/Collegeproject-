import { Route, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient.js';
import AllocationGatewayPage  from '../pages/AllocationGatewayPage';
import SquadLobbyPage         from '../pages/SquadLobbyPage';
import WaitingRoomPage        from '../pages/WaitingRoomPage';
import LiveSelectionPage      from '../pages/LiveSelectionPage';
import SelectionLockedPage    from '../pages/SelectionLockedPage';
import AllocationResultsPage  from '../pages/AllocationResultsPage';
import PenaltyPage            from '../pages/PenaltyPage';
import ShatteredPage          from '../pages/ShatteredPage';
import AllocationHistoryPage  from '../pages/AllocationHistoryPage';
import RoomGridPage           from '../pages/RoomGridPage';
import PreferencesPage        from '../pages/PreferencesPage';
import AllocationAdminPage    from '../pages/AllocationAdminPage';
import ErrorBoundary          from '../components/shared/ErrorBoundary';

/**
 * AllocationRoutes — renders all room_allocation module routes.
 * Usage: embed inside a parent <Routes> in main.jsx.
 */

function AllocationRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

const AllocationRoutes = [
  <Route key="root" element={<AllocationRoot />}>
    <Route key="gw"      path="/allocation"                  element={<AllocationGatewayPage />}         errorElement={<ErrorBoundary />} />
    <Route key="squad"   path="/allocation/squad"            element={<SquadLobbyPage hasGroup={true}  />} errorElement={<ErrorBoundary />} />
    <Route key="solo"    path="/allocation/squad-solo"       element={<SquadLobbyPage hasGroup={false} />} errorElement={<ErrorBoundary />} />
    <Route key="wait"    path="/allocation/waiting-room"     element={<WaitingRoomPage />}               errorElement={<ErrorBoundary />} />
    <Route key="live"    path="/allocation/selection/live"   element={<LiveSelectionPage />}             errorElement={<ErrorBoundary />} />
    <Route key="locked"  path="/allocation/selection/locked" element={<SelectionLockedPage />}           errorElement={<ErrorBoundary />} />
    <Route key="results" path="/allocation/results"          element={<AllocationResultsPage />}         errorElement={<ErrorBoundary />} />
    <Route key="penalty"    path="/allocation/penalty"          element={<PenaltyPage />}                   errorElement={<ErrorBoundary />} />
    <Route key="shattered"  path="/allocation/shattered"        element={<ShatteredPage />}                 errorElement={<ErrorBoundary />} />
    <Route key="history" path="/allocation/history"          element={<AllocationHistoryPage />}         errorElement={<ErrorBoundary />} />
    <Route key="grid"    path="/allocation/room-grid"        element={<RoomGridPage />}                  errorElement={<ErrorBoundary />} />
    <Route key="pref"    path="/allocation/preferences"      element={<PreferencesPage />}               errorElement={<ErrorBoundary />} />
    <Route key="admin"   path="/allocation/admin"            element={<AllocationAdminPage />}           errorElement={<ErrorBoundary />} />
  </Route>
];

export default AllocationRoutes;
