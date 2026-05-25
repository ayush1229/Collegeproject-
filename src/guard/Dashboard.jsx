import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  apiFetch,
} from "../utils/api";

function formatDate(date) {

  if (!date) return "-";

  return new Date(date)
    .toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
}

export default function Dashboard() {

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [sort, setSort] =
    useState("LATEST");

  /* ================= FETCH ================= */

  useEffect(() => {

    fetchDashboard();

  }, []);

  async function fetchDashboard() {

    try {

      setLoading(true);

      const result =
        await apiFetch(
          "/api/outpasses/monitor"
        );

      setData(
        result?.data || []
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

  /* ================= FILTER ================= */

  const filtered =
    useMemo(() => {

      let list = [...data];

      if (status !== "All") {

        list = list.filter(
          (o) =>
            o.std_status ===
            status
        );
      }

      if (search.trim()) {

        const q =
          search.toLowerCase();

        list = list.filter(
          (o) =>

            o.name
              ?.toLowerCase()
              .includes(q)

            ||

            o.roll_no
              ?.toLowerCase()
              .includes(q)

            ||

            o.room
              ?.toLowerCase()
              .includes(q)

            ||

            o.hostel
              ?.toLowerCase()
              .includes(q)
        );
      }

      list.sort((a, b) =>

        sort === "LATEST"

          ? new Date(
              b.created_at
            ) -
            new Date(
              a.created_at
            )

          : new Date(
              a.created_at
            ) -
            new Date(
              b.created_at
            )
      );

      return list;

    }, [
      data,
      search,
      status,
      sort,
    ]);

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <div className="text-center py-20 text-gray-500">

        Loading dashboard...

      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div>

        <h1 className="text-3xl font-bold text-[#6d0f16]">

          Guard Dashboard

        </h1>

        <p className="text-gray-500 mt-1">

          Monitor all student outpass activity

        </p>

      </div>

      {/* ================= ERROR ================= */}

      {error && (

        <div className="bg-red-50 text-red-600 border border-red-200 rounded-2xl p-4">

          {error}

        </div>
      )}

      {/* ================= FILTERS ================= */}

      <div className="bg-white border rounded-3xl p-5 flex flex-wrap gap-4">

        <input
          type="text"
          placeholder="Search student / room / roll..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="flex-1 min-w-[250px] border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6d0f16]"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="border rounded-2xl px-4 py-3"
        >

          <option value="All">

            All

          </option>

          <option value="In">

            In

          </option>

          <option value="Out">

            Out

          </option>

        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value
            )
          }
          className="border rounded-2xl px-4 py-3"
        >

          <option value="LATEST">

            Latest First

          </option>

          <option value="OLDEST">

            Oldest First

          </option>

        </select>

      </div>

      {/* ================= LIST ================= */}

      <div className="space-y-5">

        {filtered.map((o) => (

          <div
            key={o.id}
            className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col xl:flex-row gap-6 justify-between"
          >

            {/* LEFT */}

            <div className="flex-1">

              {/* TOP */}

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-3xl font-bold">

                  {o.name}

                </h2>

                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">

                  {o.std_status}

                </span>

                <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium">

                  {o.outp_status}

                </span>

              </div>

              {/* ROLL */}

              <p className="mt-3 text-gray-600 font-medium">

                {o.roll_no || "No Roll Number"}
                {" • "}
                {o.department}

              </p>

              {/* INFO GRID */}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">

                <InfoCard
                  label="Hostel"
                  value={o.hostel}
                />

                <InfoCard
                  label="Room"
                  value={o.room}
                />

                <InfoCard
                  label="Phone"
                  value={o.phone}
                />

                <InfoCard
                  label="Place"
                  value={
                    o.place_of_visit
                  }
                />

                <InfoCard
                  label="Purpose"
                  value={o.purpose}
                />

                <InfoCard
                  label="Parent Contact"
                  value={
                    o.parent_contact
                  }
                />

              </div>

            </div>

            {/* RIGHT */}

            <div className="w-full xl:w-[320px] space-y-4">

              <TimeCard
                title="Departure"
                value={formatDate(
                  o.departure_datetime
                )}
              />

              <TimeCard
                title="Arrival"
                value={formatDate(
                  o.arrival_datetime
                )}
              />

            </div>

          </div>
        ))}

        {!filtered.length && (

          <div className="bg-white border rounded-3xl p-10 text-center text-gray-500">

            No records found

          </div>
        )}

      </div>

    </div>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({
  label,
  value,
}) {

  return (

    <div className="border rounded-2xl p-4">

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p className="font-semibold text-lg mt-2 break-words">

        {value || "-"}

      </p>

    </div>
  );
}

/* ================= TIME CARD ================= */

function TimeCard({
  title,
  value,
}) {

  return (

    <div className="border rounded-2xl p-5">

      <p className="text-gray-500 text-sm">

        {title}

      </p>

      <p className="font-bold text-2xl mt-3 leading-relaxed">

        {value}

      </p>

    </div>
  );
}