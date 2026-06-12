import React, {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import CreateOutpass from "./CreateOutpasses";

import CancelOutpass from "./Canceloutpass";

import {
  apiFetch,
} from "../utils/api";

export default function OutpassLayout() {
  const navigate = useNavigate();

  const [active, setActive] =
    useState("my");

  const [selected, setSelected] =
    useState(null);

  const [outpasses, setOutpasses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  /* ================= LOGOUT ================= */

  function handleLogout() {

    localStorage.clear();

    window.location.href =
      "/signin";
  }

  /* ================= FETCH ================= */

  async function fetchOutpasses() {

    try {

      setLoading(true);

      setError("");

      const data =
        await apiFetch(
          "/api/outpasses/my"
        );

      console.log(data);

      setOutpasses(
        data.data || []
      );

    } catch (err) {

      console.log(err);

      setError(
        err.message
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    fetchOutpasses();

  }, []);

  /* ================= FILTER ================= */

  const filteredOutpasses =
    filter === "All"

      ? outpasses

      : outpasses.filter(
          (o) =>

            o.outp_status
              ?.toLowerCase() ===
            filter.toLowerCase()
        );

  return (

    <div className="h-screen flex bg-gray-100 overflow-hidden">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-80 bg-gradient-to-b from-[#6d0f16] to-[#8b0f18] text-white flex flex-col shadow-2xl">

        {/* HEADER */}

        <div className="p-8 border-b border-white/10">

          <h1 className="text-4xl font-bold tracking-tight">

            🎓 Outpass System

          </h1>

          <p className="text-white/70 mt-2 text-sm">

            Hostel Management Portal

          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 p-5 space-y-3">

          <NavItem
            title="My Outpasses"
            active={active === "my"}
            onClick={() =>
              setActive("my")
            }
          />

          <NavItem
            title="Create Outpass"
            active={
              active === "create"
            }
            onClick={() =>
              setActive("create")
            }
          />

          <NavItem
            title="Cancel Outpass"
            active={
              active === "cancel"
            }
            onClick={() =>
              setActive("cancel")
            }
          />

          <NavItem
            title="Complaints"
            active={false}
            onClick={() =>
              navigate("/complaint")
            }
          />

        </nav>

        {/* LOGOUT */}

        <div className="p-5 border-t border-white/10">

          <button
            onClick={handleLogout}
            className="w-full bg-white text-[#6d0f16] font-semibold py-3 rounded-2xl hover:bg-gray-100 transition"
          >

            Logout

          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex-1 overflow-y-auto p-8">

        {/* LOADING */}

        {loading && (

          <div className="bg-white rounded-3xl border p-10 text-center text-gray-500 shadow-sm">

            Loading outpasses...

          </div>
        )}

        {/* ERROR */}

        {error && (

          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-5">

            {error}

          </div>
        )}

        {/* ================= DASHBOARD ================= */}

        {!loading &&
          active === "my" && (

          <>

            {/* HEADER */}

            <div className="flex flex-wrap justify-between gap-4 mb-8">

              <div>

                <h2 className="text-4xl font-bold text-[#6d0f16]">

                  Student Dashboard

                </h2>

                <p className="text-gray-500 mt-2 text-lg">

                  Manage your hostel outpasses

                </p>

              </div>

              <div className="bg-white border rounded-3xl px-6 py-5 shadow-sm min-w-[150px]">

                <p className="text-sm text-gray-500">

                  Total Requests

                </p>

                <p className="text-5xl font-bold text-[#6d0f16] mt-2">

                  {outpasses.length}

                </p>

              </div>

            </div>

            {/* CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

              <DashboardCard
                title="Total"
                value={outpasses.length}
                subtitle="All requests"
              />

              <DashboardCard
                title="Pending"
                value={
                  outpasses.filter(
                    (o) =>
                      o.outp_status
                        ?.toLowerCase() ===
                      "pending"
                  ).length
                }
                subtitle="Waiting approval"
              />

              <DashboardCard
                title="Approved"
                value={
                  outpasses.filter(
                    (o) =>
                      o.outp_status
                        ?.toLowerCase() ===
                      "approved"
                  ).length
                }
                subtitle="Approved requests"
              />

              <DashboardCard
                title="Rejected"
                value={
                  outpasses.filter(
                    (o) =>
                      o.outp_status
                        ?.toLowerCase() ===
                      "rejected"
                  ).length
                }
                subtitle="Rejected requests"
              />

            </div>

            {/* FILTERS */}

            <div className="flex gap-3 mb-6 flex-wrap">

              {[
                "All",
                "Pending",
                "Approved",
                "Rejected",
              ].map((status) => (

                <button
                  key={status}
                  onClick={() =>
                    setFilter(status)
                  }
                  className={`px-6 py-3 rounded-full text-sm font-semibold border transition-all
                  ${
                    filter === status

                      ? "bg-[#6d0f16] text-white border-[#6d0f16] shadow"

                      : "bg-white hover:bg-gray-100 border-gray-300"
                  }`}
                >

                  {status}

                  <span className="ml-2 text-xs opacity-80">

                    (
                    {
                      status === "All"

                        ? outpasses.length

                        : outpasses.filter(
                            (o) =>
                              o.outp_status
                                ?.toLowerCase() ===
                              status.toLowerCase()
                          ).length
                    }
                    )

                  </span>

                </button>
              ))}

            </div>

            {/* TABLE */}

            <MyOutpasses
              outpasses={
                filteredOutpasses
              }
              setSelected={
                setSelected
              }
            />

          </>
        )}

        {/* CREATE */}

        {active === "create" && (

          <CreateOutpass
            setActive={setActive}
            fetchOutpasses={
              fetchOutpasses
            }
          />
        )}

        {/* CANCEL */}

        {active === "cancel" && (

          <CancelOutpass
            outpasses={outpasses}
            setOutpasses={
              setOutpasses
            }
            setActive={setActive}
            fetchOutpasses={
              fetchOutpasses
            }
          />
        )}

        {/* MODAL */}

        {selected && (

          <OutpassModal
            outpass={selected}
            onClose={() =>
              setSelected(null)
            }
          />
        )}

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

/* ================= DASHBOARD CARD ================= */

function DashboardCard({
  title,
  value,
  subtitle,
}) {

  return (

    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500 font-medium">

            {title}

          </p>

          <h2 className="text-5xl font-bold text-[#6d0f16] mt-2">

            {value}

          </h2>

          <p className="text-xs text-gray-400 mt-2">

            {subtitle}

          </p>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#f8eaea] flex items-center justify-center text-[#6d0f16] text-2xl">

          📄

        </div>

      </div>

    </div>
  );
}

/* ================= TABLE ================= */

function MyOutpasses({
  outpasses,
  setSelected,
}) {

  if (
    !outpasses ||
    outpasses.length === 0
  ) {

    return (

      <div className="bg-white rounded-3xl shadow border p-16 text-center text-gray-500 text-xl">

        No outpasses found

      </div>
    );
  }

  return (

    <div className="bg-white rounded-3xl shadow border overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-gray-50 border-b">

          <tr>

            <th className="p-5 text-left">
              ID
            </th>

            <th className="text-left">
              Type
            </th>

            <th className="text-left">
              Place
            </th>

            <th className="text-left">
              Status
            </th>

            <th className="text-left">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {outpasses.map((o) => (

            <tr
              key={o.id}
              className="border-b hover:bg-gray-50 transition"
            >

              <td className="p-5 font-semibold">

                OP-{o.id}

              </td>

              <td>
                {o.outpass_type}
              </td>

              <td>
                {o.place_of_visit}
              </td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    o.outp_status
                      ?.toLowerCase() ===
                    "approved"

                      ? "bg-green-100 text-green-700"

                      : o.outp_status
                          ?.toLowerCase() ===
                        "pending"

                      ? "bg-yellow-100 text-yellow-700"

                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {o.outp_status}

                </span>

              </td>

              <td>

                <button
                  onClick={() =>
                    setSelected(o)
                  }
                  className="bg-[#6d0f16] hover:bg-[#560c12] text-white px-4 py-2 rounded-xl text-xs transition"
                >

                  View

                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

/* ================= MODAL ================= */

function OutpassModal({
  outpass,
  onClose,
}) {

  return (

    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-7 relative">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-xl text-gray-500 hover:text-black"
        >

          ✕

        </button>

        <h2 className="text-3xl font-bold text-[#6d0f16] mb-6">

          Outpass Details

        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <Detail
            label="Type"
            value={
              outpass.outpass_type
            }
          />

          <Detail
            label="Place"
            value={
              outpass.place_of_visit
            }
          />

          <Detail
            label="Purpose"
            value={
              outpass.purpose
            }
          />

          <Detail
            label="Departure"
            value={
              outpass.departure_datetime
                ? new Date(
                    outpass.departure_datetime
                  ).toLocaleString("en-IN")
                : "-"
            }
          />

          <Detail
            label="Arrival"
            value={
              outpass.arrival_datetime
                ? new Date(
                    outpass.arrival_datetime
                  ).toLocaleString("en-IN")
                : "-"
            }
          />

          <Detail
            label="Status"
            value={
              outpass.outp_status
            }
          />

        </div>

      </div>

    </div>
  );
}

/* ================= DETAIL ================= */

function Detail({
  label,
  value,
}) {

  return (

    <div className="bg-gray-50 border rounded-2xl p-4">

      <p className="text-xs text-gray-500 mb-1">

        {label}

      </p>

      <p className="font-semibold text-sm text-gray-800 break-words">

        {value || "-"}

      </p>

    </div>
  );
}