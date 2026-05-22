import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  apiFetch,
} from "../utils/api";

export default function ExitPage() {

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [processingId, setProcessingId] =
    useState(null);

  /* ================= FETCH ================= */

  async function fetchStudents() {

    try {

      setLoading(true);

      setError("");

      const data =
        await apiFetch(
          "/api/outpasses/monitor"
        );

      console.log(data);

      const filtered =
        (data.data || []).filter(
          (o) =>

            o.outp_status ===
              "Approved" &&

            o.is_active ===
              true &&

            o.std_status ===
              "In"
        );

      setStudents(filtered);

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

    fetchStudents();

  }, []);

  /* ================= SEARCH ================= */

  const filteredStudents =
    useMemo(() => {

      const query =
        search.toLowerCase();

      return students.filter(
        (s) =>

          s.name
            ?.toLowerCase?.()
            ?.includes(query) ||

          s.roll_no
            ?.toLowerCase?.()
            ?.includes(query)
      );

    }, [students, search]);

  /* ================= MARK EXIT ================= */

  async function handleExit(
    outpassId
  ) {

    try {

      setProcessingId(
        outpassId
      );

      console.log(
        "Marking Exit:",
        outpassId
      );

      /* ================= IMPORTANT ================= */

      // Your backend route is probably:
      // POST /api/outpasses/record-entry

      await apiFetch(
        "/api/outpasses/record-entry",
        {
          method: "POST",

          body: JSON.stringify({

            outpass_id:
              outpassId,

            action: "exit",

            gate: "Main Gate",
          }),
        }
      );

      await fetchStudents();

    } catch (err) {

      console.log(err);

      alert(
        err.message
      );

    } finally {

      setProcessingId(
        null
      );
    }
  }

  /* ================= UI ================= */

  return (

    <div>

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-[#6d0f16]">

            Exit Students

          </h1>

          <p className="text-gray-500 mt-2">

            Verify approved students before hostel exit

          </p>

        </div>

        <div className="bg-white border shadow-sm rounded-3xl px-6 py-5 min-w-[180px]">

          <p className="text-sm text-gray-500">

            Eligible Students

          </p>

          <p className="text-4xl font-bold text-[#6d0f16] mt-1">

            {filteredStudents.length}

          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div className="mb-6">

        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-[#6d0f16]"
        />

      </div>

      {/* ERROR */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-5">

          {error}

        </div>
      )}

      {/* LOADING */}

      {loading ? (

        <div className="bg-white rounded-3xl border shadow-sm p-10 text-center text-gray-500">

          Loading students...

        </div>

      ) : filteredStudents.length === 0 ? (

        <div className="bg-white rounded-3xl border shadow-sm p-10 text-center text-gray-500">

          No students available for exit

        </div>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {filteredStudents.map(
            (student) => {

              const outpassId =
                student.outpass_id ||
                student.id;

              return (

                <div
                  key={outpassId}
                  className="bg-white border rounded-3xl shadow-sm p-6 hover:shadow-md transition"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h2 className="text-2xl font-bold text-[#6d0f16]">

                        {student.name}

                      </h2>

                      <p className="text-gray-500 mt-1">

                        {student.roll_no ||
                          "No Roll Number"}

                      </p>

                    </div>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-semibold">

                      Approved

                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="grid grid-cols-2 gap-4 mt-6">

                    <Detail
                      label="Department"
                      value={
                        student.department
                      }
                    />

                    <Detail
                      label="Hostel"
                      value={
                        student.hostel
                      }
                    />

                    <Detail
                      label="Room"
                      value={
                        student.room
                      }
                    />

                    <Detail
                      label="Type"
                      value={
                        student.outpass_type
                      }
                    />

                    <Detail
                      label="Place"
                      value={
                        student.place_of_visit
                      }
                    />

                    <Detail
                      label="Purpose"
                      value={
                        student.purpose
                      }
                    />

                  </div>

                  {/* ACTION */}

                  <button
                    onClick={() =>
                      handleExit(
                        outpassId
                      )
                    }
                    disabled={
                      processingId ===
                      outpassId
                    }
                    className="w-full mt-6 bg-[#6d0f16] hover:bg-[#530b11] text-white py-4 rounded-2xl font-semibold transition disabled:opacity-50"
                  >

                    {processingId ===
                    outpassId

                      ? "Processing..."

                      : "Mark Exit"}
                  </button>

                </div>
              );
            }
          )}

        </div>
      )}

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