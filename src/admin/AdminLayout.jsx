import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  const isPending =
    location.pathname === "/admin" ||
    location.pathname === "/admin/pending";

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-[#5b0e0e] to-[#7a1414] text-white flex flex-col shadow-xl">

        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold">Attendant Panel</h1>
          <p className="text-xs text-white/70 mt-1">
            Outpass Management System
          </p>
        </div>

        <nav className="p-4 space-y-3">

          <SideLink to="/admin/pending" label="Pending Outpasses" />
          <SideLink to="/admin/approved" label="Approved Outpasses" />
          <SideLink to="/admin/rejected" label="Rejected Outpasses" />

        </nav>

        <div className="mt-auto p-4">
          <div className="bg-white/10 rounded-xl p-3 text-xs">
            <p className="font-semibold">Quick Rules</p>
            <ul className="list-disc ml-4 mt-2 text-white/80 space-y-1">
              <li>Verify student details</li>
              <li>Approve only valid requests</li>
              <li>Home pass needs strict check</li>
            </ul>
          </div>
        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* DEFAULT VIEW HEADER (ONLY ON PENDING) */}
       
        

        {/* PAGE CONTENT */}
        <Outlet />

      </main>

    </div>
  );
}

/* SIDEBAR LINK */
function SideLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-3 rounded-xl font-medium transition ${
          isActive
            ? "bg-white text-[#5b0e0e] shadow"
            : "hover:bg-white/10"
        }`
      }
    >
      {label}
    </NavLink>
  );
}