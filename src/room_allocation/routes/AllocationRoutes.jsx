import { Route } from 'react-router-dom';
import AllocationGatewayPage  from '../pages/AllocationGatewayPage';
import SquadLobbyPage         from '../pages/SquadLobbyPage';
import WaitingRoomPage        from '../pages/WaitingRoomPage';
import LiveSelectionPage      from '../pages/LiveSelectionPage';
import SelectionLockedPage    from '../pages/SelectionLockedPage';
import AllocationResultsPage  from '../pages/AllocationResultsPage';
import PenaltyPage            from '../pages/PenaltyPage';
import AllocationHistoryPage  from '../pages/AllocationHistoryPage';

/**
 * AllocationRoutes — renders all room_allocation module routes.
 * Usage: embed inside a parent <Routes> in main.jsx.
 *
 *   <Routes>
 *     <Route path="/" element={<App />} />
 *     {AllocationRoutes}
 *   </Routes>
 */
const AllocationRoutes = [
  <Route key="gw"      path="/allocation"                  element={<AllocationGatewayPage />}         />,
  <Route key="squad"   path="/allocation/squad"             element={<SquadLobbyPage hasGroup={true}  />}/>,
  <Route key="solo"    path="/allocation/squad-solo"        element={<SquadLobbyPage hasGroup={false} />}/>,
  <Route key="wait"    path="/allocation/waiting-room"      element={<WaitingRoomPage />}               />,
  <Route key="live"    path="/allocation/selection/live"    element={<LiveSelectionPage />}             />,
  <Route key="locked"  path="/allocation/selection/locked"  element={<SelectionLockedPage />}           />,
  <Route key="results" path="/allocation/results"           element={<AllocationResultsPage />}         />,
  <Route key="penalty" path="/allocation/penalty"           element={<PenaltyPage />}                   />,
  <Route key="history" path="/allocation/history"           element={<AllocationHistoryPage />}         />,
];

export default AllocationRoutes;
