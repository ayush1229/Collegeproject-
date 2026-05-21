import React, { useMemo, useState } from "react";

export default function ExitPage() {

  // 🔴 DUMMY DATA WITH DATE
  const [data, setData] = useState([
    {
      id: 1,
      student_name: "Rahul Sharma",
      roll: "CS101",
      room: "A-12",
      hostel: "Hostel A",
      outpass_status: "APPROVED",
      is_exited: false,
      datetime: "2024-06-20T10:30:00",
    },
    {
      id: 2,
      student_name: "Aman Verma",
      roll: "ME202",
      room: "B-07",
      hostel: "Hostel B",
      outpass_status: "APPROVED",
      is_exited: true,
      datetime: "2024-06-19T18:10:00",
    },
    {
      id: 3,
      student_name: "Sahil Khan",
      roll: "EE303",
      room: "A-21",
      hostel: "Hostel A",
      outpass_status: "APPROVED",
      is_exited: false,
      datetime: "2024-06-20T09:00:00",
    },
  ]);

  const [search, setSearch] = useState("");
  const [hostel, setHostel] = useState("All");
  const [sort, setSort] = useState("LATEST");

  // 🚪 EXIT ACTION
  function handleExit(id) {
    setData(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, is_exited: true, datetime: new Date().toISOString() }
          : s
      )
    );
  }

  // 🔍 FILTER + APPROVED
  const filtered = useMemo(() => {
    let list = data.filter(o => {
      if (o.outpass_status !== "APPROVED") return false;

      const q = search.toLowerCase();
      const matchSearch =
        o.student_name.toLowerCase().includes(q) ||
        o.roll.toLowerCase().includes(q) ||
        o.room.toLowerCase().includes(q);

      const matchHostel =
        hostel === "All" || o.hostel === hostel;

      return matchSearch && matchHostel;
    });

    // 📅 DATE SORT
    list.sort((a, b) =>
      sort === "LATEST"
        ? new Date(b.datetime) - new Date(a.datetime)
        : new Date(a.datetime) - new Date(b.datetime)
    );

    // ⬆️ NOT EXITED FIRST
    list.sort((a, b) => Number(a.is_exited) - Number(b.is_exited));

    return list;
  }, [data, search, hostel, sort]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-[#6d0f16]">
        🚪 Exit Panel
      </h1>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-3">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student / roll / room"
          className="border px-3 py-2 rounded-lg flex-1"
        />

        <select
          value={hostel}
          onChange={(e) => setHostel(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="All">All Hostels</option>
          <option value="Hostel A">Hostel A</option>
          <option value="Hostel B">Hostel B</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="LATEST">Latest First</option>
          <option value="OLDEST">Oldest First</option>
        </select>

        <div className="text-sm bg-gray-100 px-3 py-2 rounded-lg">
          Total: <b>{filtered.length}</b>
        </div>
      </div>

      {/* LIST */}
      {filtered.map(o => (
        <div
          key={o.id}
          className="border rounded-xl p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-lg">
              {o.student_name}
            </p>

            <p className="text-sm text-gray-600">
              {o.roll} • Room {o.room} • {o.hostel}
            </p>

            <p className="text-xs text-gray-400">
              {new Date(o.datetime).toLocaleString()}
            </p>

            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-semibold
              ${o.is_exited
                ? "bg-gray-200 text-gray-700"
                : "bg-green-100 text-green-700"
              }`}
            >
              {o.is_exited ? "EXITED" : "APPROVED"}
            </span>
          </div>

          {!o.is_exited ? (
            <button
              onClick={() => handleExit(o.id)}
              className="bg-red-600 text-white px-4 py-2 text-xs rounded-lg"
            >
              Mark Exit
            </button>
          ) : (
            <span className="bg-gray-300 px-4 py-2 text-xs rounded-lg">
              Done
            </span>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-gray-400">
          No approved students
        </p>
      )}
    </div>
  );
}