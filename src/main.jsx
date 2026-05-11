import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import SquadLobbyPage from './room_allocation/pages/SquadLobbyPage'
import WaitingRoomPage from './room_allocation/pages/WaitingRoomPage'

const router = createBrowserRouter([
  { path: '/',                    element: <Navigate to="/allocation/squad" replace /> },
  { path: '/allocation',          element: <Navigate to="/allocation/squad" replace /> },
  { path: '/allocation/squad',    element: <SquadLobbyPage hasGroup={true}  /> },
  { path: '/allocation/squad-solo', element: <SquadLobbyPage hasGroup={false} /> },
  { path: '/allocation/waiting-room', element: <WaitingRoomPage /> },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
