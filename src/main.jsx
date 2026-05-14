import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import App from './App.jsx'
import Sample from './sample.jsx'
import Complaint from './complaint/complaint.jsx'
import Outpass from './outpass/outpass.jsx'

// Room allocation pages
import AllocationGatewayPage from './room_allocation/pages/AllocationGatewayPage'
import SquadLobbyPage        from './room_allocation/pages/SquadLobbyPage'
import WaitingRoomPage       from './room_allocation/pages/WaitingRoomPage'
import LiveSelectionPage     from './room_allocation/pages/LiveSelectionPage'
import SelectionLockedPage   from './room_allocation/pages/SelectionLockedPage'
import AllocationResultsPage from './room_allocation/pages/AllocationResultsPage'
import PenaltyPage           from './room_allocation/pages/PenaltyPage'
import AllocationHistoryPage from './room_allocation/pages/AllocationHistoryPage'
import Login from './auth/login.jsx'
import Signup from './auth/signup.jsx'
import Student from './student/student.jsx'


const router = createBrowserRouter([
  // App routes
  { path: '/',          element: <Login />       },
  { path: '/sample',    element: <Sample />    },
  { path: '/complaint', element: <Complaint /> },
  { path: '/outpass',   element: <Outpass />   },
  { path: '/login',     element: <Login />     },
  { path: '/signup',    element: <Signup />    },
  { path: '/student',   element: <Student />   },
  

  // Room allocation module
  { path: '/allocation',                 element: <AllocationGatewayPage />              },
  { path: '/allocation/squad',           element: <SquadLobbyPage hasGroup={true}  />    },
  { path: '/allocation/squad-solo',      element: <SquadLobbyPage hasGroup={false} />    },
  { path: '/allocation/waiting-room',    element: <WaitingRoomPage />                    },
  { path: '/allocation/selection/live',  element: <LiveSelectionPage />                  },
  { path: '/allocation/selection/locked',element: <SelectionLockedPage />                },
  { path: '/allocation/results',         element: <AllocationResultsPage />              },
  { path: '/allocation/penalty',         element: <PenaltyPage />                        },
  { path: '/allocation/history',         element: <AllocationHistoryPage />              },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
