import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import Outpasses from './outpasses.jsx';
import AdminLayout from './admin/AdminLayout.jsx';

import PendingPage from './admin/PendingPage.jsx';
import ApprovedPage from './admin/ApprovedPage.jsx';
import RejectedPage from './admin/RejectedPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outpasses />
  },

  // ✅ ADMIN LAYOUT WRAPPER
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="pending" replace />
      },
      {
        path: 'pending',
        element: <PendingPage />
      },
      {
        path: 'approved',
        element: <ApprovedPage />
      },
      {
        path: 'rejected',
        element: <RejectedPage />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);