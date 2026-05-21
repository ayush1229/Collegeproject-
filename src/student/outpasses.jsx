import React, { useEffect, useState } from "react";

import CreateOutpass from "./CreateOutpasses";
import CancelOutpass from "./Canceloutpass";

export default function OutpassLayout() {

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

  /* ================= FETCH ================= */

  async function fetchOutpasses() {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem("token");

      const role =
        localStorage.getItem("role");

      if (!token || !role) {

        throw new Error(
          "Please login first"
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/outpasses/my",
        {
          method: "GET",

          headers: {
            token,
            role,
          },
        }
      );

      const data =
        await response.json();

      console.log(data);

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to fetch outpasses"
        );
      }

      setOutpasses(
        data.data || []
      );

    } catch (err) {

      console.log(err);

      setError(err.message);

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

    <div className="h-screen flex bg-gray-100">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-72 bg-gradient-to-b from-[#6d0f16] to-[#3b0a0e] text-white flex flex-col shadow-xl">

        <div className="p-6 text-xl font-bold border-b border-white/20">

          🎓 Outpass System

        </div>

        <nav className="flex-1 p-4 space-y-2">

          <SideItem
            label="My Outpasses"
            active={active === "my"}
            onClick={() =>
              setActive("my")
            }
          />

          <SideItem
            label="Create Outpass"
            active={active === "create"}
            onClick={() =>
              setActive("create")
            }
          />

          <SideItem
            label="Cancel Outpass"
            active={active === "cancel"}
            onClick={() =>
              setActive("cancel")
            }
          />

        </nav>

        <div className="p-4 text-xs text-white/60 border-t border-white/20">

          Hostel Management System

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex-1 p-10 overflow-y-auto">

        {/* ================= LOADING ================= */}

        {loading && (

          <div className="bg-white p-6 rounded-2xl border shadow text-center">

            Loading outpasses...

          </div>
        )}

        {/* ================= ERROR ================= */}

        {error && (

          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">

            {error}

          </div>
        )}

        {/* ================= DASHBOARD ================= */}

        {!loading &&
          active === "my" && (

          <>

            {/* ================= CARDS ================= */}

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

            {/* ================= FILTERS ================= */}

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
                  className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all
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

            {/* ================= TABLE ================= */}

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

        {/* ================= CREATE ================= */}

        {active === "create" && (

          <CreateOutpass
            setActive={setActive}
            fetchOutpasses={
              fetchOutpasses
            }
          />
        )}

        {/* ================= CANCEL ================= */}

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

        {/* ================= MODAL ================= */}

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

/* ================= DASHBOARD CARD ================= */

function DashboardCard({
  title,
  value,
  subtitle,
}) {

  return (

    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500 font-medium">

            {title}

          </p>

          <h2 className="text-4xl font-bold text-[#6d0f16] mt-2">

            {value}

          </h2>

          <p className="text-xs text-gray-400 mt-2">

            {subtitle}

          </p>

        </div>

        <div className="w-12 h-12 rounded-xl bg-[#f8eaea] flex items-center justify-center text-[#6d0f16] text-xl">

          📄

        </div>

      </div>

    </div>
  );
}

/* ================= SIDEBAR ================= */

function SideItem({
  label,
  active,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition font-medium
      ${
        active
          ? "bg-white text-[#6d0f16]"
          : "hover:bg-white/10"
      }`}
    >

      {label}

    </button>
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

      <div className="bg-white rounded-2xl shadow border p-10 text-center text-gray-500">

        No outpasses found

      </div>
    );
  }

  return (

    <div className="bg-white rounded-2xl shadow border overflow-hidden">

      <div className="p-4 font-semibold border-b bg-gray-50">

        My Outpasses

      </div>

      <table className="w-full text-sm">

        <thead className="bg-gray-50">

          <tr>

            <th className="p-4 text-left">
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

            <th></th>

          </tr>

        </thead>

        <tbody>

          {outpasses.map((o) => (

            <tr
              key={o.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4 font-semibold">

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
                  className={`px-3 py-1 text-xs rounded-full font-medium
                  ${
                    o.outp_status
                      ?.toLowerCase() ===
                    "approved"
                      ? "bg-green-100 text-green-700"

                      : o.outp_status
                          ?.toLowerCase() ===
                        "pending"
                      ? "bg-yellow-100 text-yellow-700"

                      : o.outp_status
                          ?.toLowerCase() ===
                        "rejected"
                      ? "bg-red-100 text-red-700"

                      : "bg-gray-200 text-gray-700"
                  }`}
                >

                  {o.outp_status}

                </span>

              </td>

              <td className="text-right pr-4">

                <button
                  onClick={() =>
                    setSelected(o)
                  }
                  className="bg-[#6d0f16] text-white px-4 py-1.5 rounded-lg text-xs"
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

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[700px] rounded-2xl shadow-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black"
        >

          ✕

        </button>

        <h2 className="text-xl font-bold text-[#6d0f16] mb-5">

          Outpass Details

        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">

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
                  ).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"
            }
          />

          <Detail
            label="Arrival"
            value={
              outpass.arrival_datetime
                ? new Date(
                    outpass.arrival_datetime
                  ).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"
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

    <div className="bg-gray-50 border rounded-xl p-3">

      <p className="text-xs text-gray-500">

        {label}

      </p>

      <p className="font-semibold text-sm">

        {value || "N/A"}

      </p>

    </div>
  );
}