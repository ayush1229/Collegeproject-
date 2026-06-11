import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  apiFetch,
} from "../utils/api";

export default function ReturnPage() {

  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [hostel, setHostel] =
    useState("All");

  const [sort, setSort] =
    useState("LATEST");

  /* ================= FETCH ================= */

  async function fetchExitedStudents() {

    try {

      setLoading(true);

      setError("");

      const result =
        await apiFetch(
          "/api/outpasses/monitor"
        );

      console.log(result);

      setLogs(
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

  useEffect(() => {

    fetchExitedStudents();

  }, []);

  /* ================= RETURN ACTION ================= */

  async function handleReturn(id) {

    try {

      const result =
        await apiFetch(
          "/api/outpasses/record-entry",
          {
            method: "POST",

            body: JSON.stringify({
              outpass_id: id,
              action: "enter",
            }),
          }
        );

      console.log(result);

      fetchExitedStudents();

    } catch (err) {

      console.log(err);

      alert(
        err.message
      );
    }
  }

  /* ================= FILTER ================= */

  const filtered =
    useMemo(() => {

      let arr = logs.filter((o) => {

        /* ONLY OUTSIDE STUDENTS */

        if (
          o.std_status !== "Out"
        ) {

          return false;
        }

        const q =
          search.toLowerCase();

        const matchSearch =

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
            .includes(q);

        const matchHostel =

          hostel === "All"

          ||

          o.hostel === hostel;

        return (
          matchSearch &&
          matchHostel
        );
      });

      /* SORT */

      arr.sort((a, b) =>

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

      return arr;

    }, [
      logs,
      search,
      hostel,
      sort,
    ]);

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <div className="p-10 text-center text-gray-500">

        Loading return panel...

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

    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div>

        <h1 className="text-3xl font-bold text-[#6d0f16]">

          Return Panel

        </h1>

        <p className="text-gray-500 mt-1">

          Record student return to hostel

        </p>

      </div>

      {/* ================= FILTER BAR ================= */}

      <div className="bg-white border rounded-2xl p-4 flex flex-wrap gap-3">

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search student / roll / room"
          className="border px-4 py-2 rounded-xl flex-1"
        />

        <select
          value={hostel}
          onChange={(e) =>
            setHostel(
              e.target.value
            )
          }
          className="border px-4 py-2 rounded-xl"
        >

          <option value="All">

            All Hostels

          </option>

          {[...new Set(
            logs.map(
              (o) => o.hostel
            )
          )].map((h) => (

            <option
              key={h}
              value={h}
            >

              {h}

            </option>
          ))}

        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value
            )
          }
          className="border px-4 py-2 rounded-xl"
        >

          <option value="LATEST">

            Latest First

          </option>

          <option value="OLDEST">

            Oldest First

          </option>

        </select>

        <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm">

          Total:
          {" "}
          <b>
            {filtered.length}
          </b>

        </div>

      </div>

      {/* ================= EMPTY ================= */}

      {filtered.length === 0 && (

        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">

          No outside students found

        </div>
      )}

      {/* ================= LIST ================= */}

      <div className="space-y-5">

        {filtered.map((o) => (

          <div
            key={o.id}
            className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition"
          >

            <div className="flex justify-between flex-wrap gap-5">

              {/* LEFT */}

              <div className="flex-1">

                <div className="flex items-center gap-3 flex-wrap">

                  <h2 className="text-2xl font-bold">

                    {o.name}

                  </h2>

                  <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">

                    Outside Campus

                  </span>

                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">

                    Approved

                  </span>

                </div>

                <p className="text-sm text-gray-500 mt-1">

                  {o.roll_no || "No Roll No"}
                  {" • "}
                  {o.department}

                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-5">

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

              {/* RIGHT */}

              <div className="min-w-[260px] space-y-4">

                <button
                  onClick={() =>
                    handleReturn(o.id)
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-medium transition"
                >

                  Mark Return

                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

/* ================= INFO ================= */

function Info({
  label,
  value,
}) {

  return (

    <div className="bg-gray-50 border rounded-xl p-3">

      <p className="text-xs text-gray-500">

        {label}

      </p>

      <p className="font-semibold text-sm mt-1 break-words">

        {value || "-"}

      </p>

    </div>
  );
}