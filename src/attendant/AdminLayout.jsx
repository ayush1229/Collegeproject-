import React, { useState } from "react";

import PendingPage from "./PendingPage";
import ApprovedPage from "./ApprovedPage";
import RejectedPage from "./RejectedPage";

export default function AdminLayout() {

  const [active, setActive] =
    useState("pending");

  return (

    <div className="h-screen flex bg-gray-100 overflow-hidden">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-80 bg-gradient-to-b from-[#6d0f16] to-[#8b0f18] text-white flex flex-col shadow-2xl">

        {/* HEADER */}

        <div className="p-8 border-b border-white/10">

          <h1 className="text-4xl font-bold tracking-tight">

            Attendant Panel

          </h1>

          <p className="text-white/70 mt-2 text-sm">

            Outpass Management System

          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 p-5 space-y-3">

          <NavItem
            title="Pending Outpasses"
            active={active === "pending"}
            onClick={() =>
              setActive("pending")
            }
          />

          <NavItem
            title="Approved Outpasses"
            active={active === "approved"}
            onClick={() =>
              setActive("approved")
            }
          />

          <NavItem
            title="Rejected Outpasses"
            active={active === "rejected"}
            onClick={() =>
              setActive("rejected")
            }
          />

        </nav>

        {/* QUICK RULES */}

        <div className="p-5">

          <div className="bg-white/10 rounded-2xl p-5 border border-white/10">

            <h3 className="font-semibold mb-3">

              Quick Rules

            </h3>

            <ul className="space-y-2 text-sm text-white/80 list-disc pl-4">

              <li>
                Verify student details
              </li>

              <li>
                Approve only valid requests
              </li>

              <li>
                Home pass needs strict check
              </li>

              <li>
                Ensure hostel discipline
              </li>

            </ul>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex-1 overflow-y-auto p-8">

        {/* PAGE HEADER */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-800">

            {active === "pending" &&
              "Pending Outpasses"}

            {active === "approved" &&
              "Approved Outpasses"}

            {active === "rejected" &&
              "Rejected Outpasses"}

          </h2>

          <p className="text-gray-500 mt-2">

            Manage hostel outpass requests efficiently.

          </p>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 min-h-[80vh] overflow-hidden">

          {active === "pending" && (
            <PendingPage />
          )}

          {active === "approved" && (
            <ApprovedPage />
          )}

          {active === "rejected" && (
            <RejectedPage />
          )}

        </div>

      </main>

    </div>
  );
}

/* ================= NAV ITEM ================= */

function NavItem({
  title,
  active,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 font-medium text-lg
      ${
        active
          ? "bg-white text-[#6d0f16] shadow-lg"
          : "hover:bg-white/10 text-white"
      }`}
    >

      {title}

    </button>
  );
}