import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "./index.css";

import App from "./App";

/* ================= AUTH ================= */

import Signup from "./auth/Signup";

/* ================= STUDENT ================= */

import OutpassLayout from "./student/outpasses";

/* ================= ATTENDANT ================= */

import AdminLayout from "./attendant/AdminLayout";

import PendingPage from "./attendant/PendingPage";

import ApprovedPage from "./attendant/ApprovedPage";

import RejectedPage from "./attendant/RejectedPage";

/* ================= GUARD ================= */

import GuardLayout from "./guard/GuardLayout";

import Dashboard from "./guard/Dashboard";

import ExitPage from "./guard/ExitPage";

import ReturnPage from "./guard/ReturnPage";

/* ================= ERROR PAGE ================= */

function ErrorPage() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="bg-white shadow-xl rounded-3xl p-10 text-center max-w-md w-full border">

        <h1 className="text-6xl font-bold text-[#6d0f16]">

          404

        </h1>

        <p className="text-xl font-semibold mt-4">

          Page Not Found

        </p>

        <p className="text-gray-500 mt-2">

          The page you are trying to access does not exist.

        </p>

        <button
          onClick={() =>
            window.location.href = "/"
          }
          className="mt-6 bg-[#6d0f16] hover:bg-[#530b11] text-white px-6 py-3 rounded-2xl transition"
        >

          Go Home

        </button>

      </div>

    </div>
  );
}

/* ================= ROUTES ================= */

const router =
  createBrowserRouter([

    /* ROOT */

    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
    },

    /* ================= SIGNUP ================= */

    {
      path: "/signup",
      element: <Signup />,
      errorElement: <ErrorPage />,
    },

    /* ================= STUDENT ================= */

    {
      path: "/student",
      element: <OutpassLayout />,
      errorElement: <ErrorPage />,
    },

    /* ================= ATTENDANT ================= */

    {
      path: "/attendant",
      element: <AdminLayout />,
      errorElement: <ErrorPage />,

      children: [

        {
          index: true,
          element: (
            <Navigate to="pending" />
          ),
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

    /* ================= GUARD ================= */

    {
      path: "/guard",
      element: <GuardLayout />,
      errorElement: <ErrorPage />,

      children: [

        {
          index: true,
          element: (
            <Navigate to="dashboard" />
          ),
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

    /* ================= FALLBACK ================= */

    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

/* ================= RENDER ================= */

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <RouterProvider
      router={router}
    />

  </StrictMode>
);