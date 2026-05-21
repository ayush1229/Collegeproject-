import React, { useState } from "react";
import CreateOutpass from "./CreateOutpasses";
import CancelOutpass from "./Canceloutpass";

const initialOutpasses = [
  {
    id: 1,
    outpass_type: "Local",
    place_of_visit: "Market",
    purpose: "Shopping",
    departure_datetime: "2026-05-12T18:00",
    arrival_datetime: "2026-05-12T21:00",
    status: "Approved",
  },
  {
    id: 2,
    outpass_type: "Home",
    place_of_visit: "Hamirpur",
    purpose: "Family Function",
    departure_datetime: "2026-05-17T09:00",
    arrival_datetime: "2026-05-18T20:00",
    status: "Pending",
  },
];

export default function OutpassLayout() {
  const [active, setActive] = useState("my");
  const [selected, setSelected] = useState(null);
  const [outpasses, setOutpasses] = useState(initialOutpasses);

  return (
    <div className="h-screen flex bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-gradient-to-b from-[#6d0f16] to-[#3b0a0e] text-white flex flex-col shadow-xl">

        <div className="p-6 text-xl font-bold border-b border-white/20">
          🎓 Outpass System
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <SideItem label="My Outpasses" active={active==="my"} onClick={()=>setActive("my")} />
          <SideItem label="Create Outpass" active={active==="create"} onClick={()=>setActive("create")} />
          <SideItem label="Cancel Outpass" active={active==="cancel"} onClick={()=>setActive("cancel")} />

        </nav>

        <div className="p-4 text-xs text-white/60 border-t border-white/20">
          Hostel Management System
        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-10 overflow-y-auto">

       

        {/* 🔥 INSTRUCTIONS ALWAYS VISIBLE */}
        <InstructionBox />

        {/* ROUTING */}
        {active === "my" && (
          <MyOutpasses outpasses={outpasses} setSelected={setSelected} />
        )}

        {active === "create" && (
          <CreateOutpass
            setOutpasses={setOutpasses}
            setActive={setActive}
          />
        )}

        {active === "cancel" && (
          <CancelOutpass
            outpasses={outpasses}
            setOutpasses={setOutpasses}
            setActive={setActive}
          />
        )}

        {/* MODAL */}
        {selected && (
          <OutpassModal
            outpass={selected}
            onClose={() => setSelected(null)}
          />
        )}

      </main>
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */
function SideItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition font-medium
        ${active ? "bg-white text-[#6d0f16]" : "hover:bg-white/10"}`}
    >
      {label}
    </button>
  );
}

/* ================= INSTRUCTIONS (GLOBAL FIX) ================= */
function InstructionBox() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border mb-6">

      <h2 className="text-[#6d0f16] font-semibold text-lg mb-3">
        📌 Instructions
      </h2>

      <ul className="text-sm text-gray-600 space-y-2 list-disc ml-5">
       
        <li>Home outpass requires 48 hours approval</li>
        <li>Maximum 4 outpasses per month allowed</li>
        <li>Return before 8 PM strictly</li>
      </ul>

    </div>
  );
}

/* ================= TABLE ================= */
function MyOutpasses({ outpasses, setSelected }) {
  return (
    <div className="bg-white rounded-2xl shadow border overflow-hidden">

      <div className="p-4 font-semibold border-b bg-gray-50">
        My Outpasses
      </div>

      <table className="w-full text-sm">

        <tbody>
          {outpasses.map(o => (
            <tr key={o.id} className="border-t hover:bg-gray-50">

              <td className="p-4 font-semibold">OP-{o.id}</td>
              <td>{o.outpass_type}</td>
              <td>{o.place_of_visit}</td>

              <td>
                <span className={`px-3 py-1 text-xs rounded-full
                  ${o.status==="Approved"
                    ? "bg-green-100 text-green-700"
                    : o.status==="Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                  {o.status}
                </span>
              </td>

              <td className="text-right pr-4">
                <button
                  onClick={() => setSelected(o)}
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
function OutpassModal({ outpass, onClose }) {

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[700px] rounded-2xl shadow-2xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* PRINT AREA */}
        <div id="print-area">

          <h2 className="text-xl font-bold text-[#6d0f16] mb-5">
            Outpass Details
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <Detail label="Type" value={outpass.outpass_type} />
            <Detail label="Place" value={outpass.place_of_visit} />
            <Detail label="Purpose" value={outpass.purpose} />
            <Detail label="Departure" value={outpass.departure_datetime} />
            <Detail label="Arrival" value={outpass.arrival_datetime} />
            <Detail label="Status" value={outpass.status} />

          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#6d0f16] text-white rounded-lg"
          >
            Print / Download PDF
          </button>

        </div>

      </div>

      {/* PRINT STYLE (IMPORTANT) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #print-area, #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 20px;
          }

          button {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}

/* ================= DETAIL ================= */
function Detail({ label, value }) {
  return (
    <div className="bg-gray-50 border rounded-xl p-3">

      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-sm">{value}</p>

    </div>
  );
}