import React, { useMemo, useState } from "react";

export default function Dashboard() {
  const [hostel, setHostel] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("LATEST");

  // 🧪 DUMMY DATA WITH DATE
  const [students] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      room: "A-12",
      roll: "CS101",
      hostel: "Hostel A",
      movement: "OUT",
      outpass: "APPROVED",
      datetime: "2024-06-20T10:45:00",
    },
    {
      id: 2,
      name: "Aman Verma",
      room: "B-21",
      roll: "CS102",
      hostel: "Hostel B",
      movement: "IN",
      outpass: "APPROVED",
      datetime: "2024-06-20T11:10:00",
    },
    {
      id: 3,
      name: "Rohit",
      room: "C-5",
      roll: "CS103",
      hostel: "Hostel A",
      movement: "IN",
      outpass: "REJECTED",
      datetime: "2024-06-19T09:30:00",
    },
  ]);

  // 📊 STATS
  const summary = useMemo(() => ({
    in: students.filter(s => s.movement === "IN").length,
    out: students.filter(s => s.movement === "OUT").length,
  }), [students]);

  // 🔍 FILTER + SORT
  const filtered = useMemo(() => {
    let list = students.filter(s => {
      const matchHostel = hostel === "All" || s.hostel === hostel;

      const q = search.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.room.toLowerCase().includes(q) ||
        s.roll.toLowerCase().includes(q);

      return matchHostel && matchSearch;
    });

    // 📅 DATE SORT
    list.sort((a, b) =>
      sort === "LATEST"
        ? new Date(b.datetime) - new Date(a.datetime)
        : new Date(a.datetime) - new Date(b.datetime)
    );

    return list;
  }, [students, search, hostel, sort]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#6d0e16]">
          👮 Guard Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          IN / OUT status (date wise)
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{summary.in}</p>
          <p className="text-sm text-gray-500">IN Campus</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{summary.out}</p>
          <p className="text-sm text-gray-500">OUT Campus</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-3">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name / room / roll..."
          className="border px-3 py-2 rounded-lg text-sm w-full"
        />

        <select
          value={hostel}
          onChange={(e) => setHostel(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm w-full md:w-44"
        >
          <option value="All">All Hostels</option>
          <option value="Hostel A">Hostel A</option>
          <option value="Hostel B">Hostel B</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm w-full md:w-44"
        >
          <option value="LATEST">Latest First</option>
          <option value="OLDEST">Oldest First</option>
        </select>

      </div>

      {/* LIST */}
      <div className="space-y-3">
        {filtered.map(s => (
          <div
            key={s.id}
            className="bg-white border rounded-xl p-4 flex justify-between items-center"
          >

            {/* LEFT */}
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-500">
                Room {s.room} | Roll {s.roll}
              </p>
              <p className="text-xs text-gray-400">{s.hostel}</p>

              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full
                ${s.outpass === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}>
                {s.outpass}
              </span>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <span className={`px-3 py-1 text-xs rounded-full font-semibold
                ${s.movement === "IN"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-orange-100 text-orange-700"
                }`}>
                {s.movement}
              </span>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(s.datetime).toLocaleString()}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}