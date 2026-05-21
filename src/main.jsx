import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Pages
import Outpasses from "./outpasses.jsx";

// Admin
import AdminLayout from "./admin/AdminLayout.jsx";
import PendingPage from "./admin/PendingPage.jsx";
import ApprovedPage from "./admin/ApprovedPage.jsx";
import RejectedPage from "./admin/RejectedPage.jsx";

// Guard (dummy pages we created)
import GuardLayout from "./guard/GuardLayout.jsx";
import ExitPage from "./guard/ExitPage.jsx";
import ReturnPage from "./guard/ReturnPage.jsx";
import Dashboard from "./guard/Dashboard.jsx";

const router = createBrowserRouter([
  // ---------------- HOME ----------------
  {
    path: "/",
    element: <Outpasses />,
  },

  // ---------------- ADMIN PANEL ----------------
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="pending" replace />,
      },
      {
        path: "pending",
        element: <PendingPage />,
      },
      {
        path: "approved",
        element: <ApprovedPage />,
      },
      {
        path: "rejected",
        element: <RejectedPage />,
      },
    ],
  },

  // ---------------- GUARD PANEL ----------------
  {
    path: "/guard",
    element: <GuardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "exit",
        element: <ExitPage />,
      },
      {
        path: "return",
        element: <ReturnPage />,
      },
    ],
  },

  // ---------------- FALLBACK ----------------
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);