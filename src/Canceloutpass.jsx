import { useState } from "react";

export default function CancelOutpass({
  outpasses,
  setOutpasses,
  setActive,
}) {
  const [selectedOutpass, setSelectedOutpass] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successId, setSuccessId] = useState(null);

  function confirmCancel() {
    setOutpasses(prev =>
      prev.map(o =>
        o.id === selectedOutpass.id
          ? { ...o, status: "Cancelled" }
          : o
      )
    );

    setShowConfirm(false);
    setSelectedOutpass(null);
    setSuccessId(selectedOutpass.id);

    setTimeout(() => {
      setSuccessId(null);
      setActive("my");
    }, 1500);
  }

  return (
    <div className="bg-white p-6 rounded-2xl border shadow max-w-3xl mx-auto">

      <h2 className="font-semibold text-xl text-[#6d0f16] mb-5">
        Cancel Outpass
      </h2>

      {/* SUCCESS */}
      {successId && (
        <div className="mb-4 bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg">
          ✅ Outpass <b>OP-{successId}</b> cancelled successfully
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {outpasses.map(o => (
          <div
            key={o.id}
            className="flex justify-between items-center border rounded-xl p-4 hover:shadow"
          >
            <div>
              <p className="font-medium">OP-{o.id}</p>
              <p className="text-xs text-gray-500">{o.status}</p>
            </div>

            <button
              onClick={() => setSelectedOutpass(o)}
              className="bg-[#6d0f16] text-white px-3 py-1 text-xs rounded-lg"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 MODAL (SHOW OUTPASS) */}
      {selectedOutpass && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[550px] rounded-2xl shadow-xl p-6 relative">

            <button
              onClick={() => setSelectedOutpass(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-[#6d0f16] mb-4">
              Outpass Details
            </h3>

            {/* STATUS */}
            <div className="mb-4">
              <span className={`px-3 py-1 text-xs rounded-full ${
                selectedOutpass.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : selectedOutpass.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {selectedOutpass.status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="ID" value={`OP-${selectedOutpass.id}`} />
              <Detail label="Type" value={selectedOutpass.outpass_type} />
              <Detail label="Place" value={selectedOutpass.place_of_visit} />
              <Detail label="Purpose" value={selectedOutpass.purpose} />
              <Detail label="Departure" value={selectedOutpass.departure_datetime} />
              <Detail label="Arrival" value={selectedOutpass.arrival_datetime} />
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setSelectedOutpass(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Close
              </button>

              <button
                onClick={() => setShowConfirm(true)}
                disabled={selectedOutpass.status === "Cancelled"}
                className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-300"
              >
                Cancel Outpass
              </button>

            </div>
          </div>
        </div>
      )}

      {/* CONFIRM POPUP */}
      {showConfirm && (
        <ConfirmModal
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmCancel}
        />
      )}
    </div>
  );
}

/* ---------- CONFIRM ---------- */

function ConfirmModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[380px] p-6 rounded-2xl shadow text-center">

        <h3 className="font-semibold text-lg text-[#6d0f16] mb-2">
          Confirm Cancellation
        </h3>

        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to cancel this outpass?
        </p>

        <div className="flex justify-center gap-3">

          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Yes Cancel
          </button>

        </div>
      </div>
    </div>
  );
}

/* ---------- DETAIL ---------- */

function Detail({ label, value }) {
  return (
    <div className="bg-gray-50 border rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}