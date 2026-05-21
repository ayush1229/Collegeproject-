import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import OutpassModal from "./OutpassModal";

export default function ApprovedPage() {

  const [selected, setSelected] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("latest");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [data, setData] =
    useState([]);

  /* ================= FETCH ================= */

  async function fetchApproved() {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem("token");

      const role =
        localStorage.getItem("role");

      const response = await fetch(
        "http://localhost:5000/api/students/status",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            token,
            role,
          },

          body: JSON.stringify({
            outp_status:
              "Approved",
          }),
        }
      );

      const result =
        await response.json();

      console.log(result);

      if (!response.ok) {

        throw new Error(
          result.message ||
          "Failed to fetch approved outpasses"
        );
      }

      setData(
        result.data || []
      );

    } catch (err) {

      console.log(err);

      setError(err.message);

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    fetchApproved();

  }, []);

  /* ================= FILTER + SORT ================= */

  const processed =
    useMemo(() => {

      let arr = [...data];

      /* SEARCH */

      arr = arr.filter((o) => {

        const q =
          search.toLowerCase();

        return (

          o.name
            ?.toLowerCase()
            .includes(q) ||

          o.roll_no
            ?.toLowerCase()
            .includes(q) ||

          o.department
            ?.toLowerCase()
            .includes(q) ||

          o.room
            ?.toLowerCase()
            .includes(q) ||

          o.hostel
            ?.toLowerCase()
            .includes(q) ||

          o.place_of_visit
            ?.toLowerCase()
            .includes(q) ||

          o.purpose
            ?.toLowerCase()
            .includes(q)
        );
      });

      /* FILTER */

      if (filter !== "All") {

        arr = arr.filter(
          (o) =>
            o.outpass_type ===
            filter
        );
      }

      /* SORT */

      if (sortBy === "latest") {

        arr.sort(
          (a, b) =>
            new Date(
              b.created_at
            ) -
            new Date(
              a.created_at
            )
        );
      }

      if (sortBy === "departure") {

        arr.sort(
          (a, b) =>
            new Date(
              a.departure_datetime
            ) -
            new Date(
              b.departure_datetime
            )
        );
      }

      return arr;

    }, [
      data,
      search,
      filter,
      sortBy,
    ]);

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <div className="p-10 text-center text-gray-500">

        Loading approved outpasses...

      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {

    return (

      <div className="p-10 text-red-600">

        {error}

      </div>
    );
  }

  return (

    <div className="p-6 space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-wrap justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-green-700">

            Approved Outpasses

          </h1>

          <p className="text-gray-500 mt-1">

            Successfully approved requests

          </p>

        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-3">

          <input
            placeholder="Search student, roll no..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="border px-4 py-2 rounded-xl text-sm bg-white"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            className="border px-4 py-2 rounded-xl text-sm bg-white"
          >

            <option>
              All
            </option>

            <option>
              Local
            </option>

            <option>
              Outstation
            </option>

          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="border px-4 py-2 rounded-xl text-sm bg-white"
          >

            <option value="latest">
              Latest
            </option>

            <option value="departure">
              Departure Time
            </option>

          </select>

        </div>

      </div>

      {/* ================= EMPTY ================= */}

      {processed.length === 0 && (

        <div className="bg-white border rounded-3xl p-10 text-center text-gray-500 shadow-sm">

          No approved outpasses found

        </div>
      )}

      {/* ================= LIST ================= */}

      <div className="space-y-5">

        {processed.map((o) => (

          <div
            key={o.id}
            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition"
          >

            {/* TOP */}

            <div className="flex justify-between items-start flex-wrap gap-4">

              <div>

                <div className="flex items-center gap-3 flex-wrap">

                  <h2 className="text-2xl font-bold text-gray-800">

                    {o.name}

                  </h2>

                  <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">

                    Approved

                  </span>

                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">

                    {o.outpass_type}

                  </span>

                </div>

                <p className="text-sm text-gray-500 mt-1">

                  {o.roll_no} • {o.department}

                </p>

              </div>

              <button
                onClick={() =>
                  setSelected(o)
                }
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
              >

                View

              </button>

            </div>

            {/* INFO */}

            <div className="grid lg:grid-cols-2 gap-6 mt-6">

              <div className="bg-gray-50 border rounded-2xl p-5">

                <h3 className="font-semibold text-gray-700 mb-4">

                  Student Information

                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">

                  <Info
                    label="Hostel"
                    value={o.hostel}
                  />

                  <Info
                    label="Room"
                    value={o.room}
                  />

                  <Info
                    label="Phone"
                    value={o.phone}
                  />

                  <Info
                    label="Email"
                    value={o.email}
                  />

                </div>

              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">

                <h3 className="font-semibold text-green-700 mb-4">

                  Outpass Information

                </h3>

                <div className="space-y-4 text-sm">

                  <Info
                    label="Place"
                    value={
                      o.place_of_visit
                    }
                  />

                  <Info
                    label="Purpose"
                    value={o.purpose}
                  />

                  <Info
                    label="Parent Contact"
                    value={
                      o.parent_contact
                    }
                  />

                </div>

              </div>

            </div>

            {/* TIME */}

            <div className="grid md:grid-cols-2 gap-4 mt-5">

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">

                <p className="text-xs text-blue-600 mb-1">

                  Departure Time

                </p>

                <p className="font-semibold text-gray-800">

                  {new Date(
                    o.departure_datetime
                  ).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}

                </p>

              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">

                <p className="text-xs text-green-600 mb-1">

                  Arrival Time

                </p>

                <p className="font-semibold text-gray-800">

                  {new Date(
                    o.arrival_datetime
                  ).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}

                </p>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ================= MODAL ================= */}

      {selected && (

        <OutpassModal
          outpass={selected}
          onClose={() =>
            setSelected(null)
          }
        />
      )}

    </div>
  );
}

function Info({
  label,
  value,
}) {

  return (

    <div className="bg-white border rounded-xl p-3">

      <p className="text-xs text-gray-500">

        {label}

      </p>

      <p className="font-semibold text-sm text-gray-800 mt-1 break-words">

        {value || "-"}

      </p>

    </div>
  );
}