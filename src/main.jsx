import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import App from './App.jsx'
import Sample from './sample.jsx'
import Complaint from './complaint/complaint.jsx'
import Outpass from './outpass/outpass.jsx'

import SquadLobbyPage from './room_allocation/pages/SquadLobbyPage'
import WaitingRoomPage from './room_allocation/pages/WaitingRoomPage'

const router = createBrowserRouter([
  { path: '/',                    element: <App /> },
  { path: '/sample',              element: <Sample /> },
  { path: '/complaint',           element: <Complaint /> },
  { path: '/outpass',             element: <Outpass /> },
  { path: '/allocation',          element: <Navigate to="/allocation/squad" replace /> },
  { path: '/allocation/squad',    element: <SquadLobbyPage hasGroup={true}  /> },
  { path: '/allocation/squad-solo', element: <SquadLobbyPage hasGroup={false} /> },
  { path: '/allocation/waiting-room', element: <WaitingRoomPage /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
