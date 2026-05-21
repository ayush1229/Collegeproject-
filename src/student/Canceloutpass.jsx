import { useState } from "react";

export default function CancelOutpass({
  outpasses,
  setOutpasses,
  setActive,
  fetchOutpasses,
}) {

  const [selectedOutpass, setSelectedOutpass] =
    useState(null);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [successId, setSuccessId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ================= ACTIVE ONLY ================= */

  const activeOutpasses =
    outpasses.filter((o) => {

      const status =
        o.outp_status?.toLowerCase();

      return (
        status === "pending" ||
        status === "approved"
      );
    });

  /* ================= CANCEL ================= */

  async function confirmCancel() {

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
        `http://localhost:5000/api/outpasses/cancel/${selectedOutpass.id}`,
        {
          method: "PATCH",

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
          "Failed to cancel outpass"
        );
      }

      /* UPDATE */

      setOutpasses((prev) =>
        prev.map((o) =>
          o.id === selectedOutpass.id
            ? {
                ...o,
                outp_status:
                  "Rejected",
              }
            : o
        )
      );

      /* REFRESH */

      if (fetchOutpasses) {

        await fetchOutpasses();
      }

      setShowConfirm(false);

      setSelectedOutpass(null);

      setSuccessId(
        selectedOutpass.id
      );

      setTimeout(() => {

        setSuccessId(null);

        setActive("my");

      }, 1500);

    } catch (err) {

      console.log(err);

      setError(err.message);

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="bg-white p-6 rounded-2xl border shadow max-w-3xl mx-auto">

      <h2 className="font-semibold text-xl text-[#6d0f16] mb-5">

        Cancel Outpass

      </h2>

      {/* ERROR */}

      {error && (

        <div className="mb-4 bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg">

          {error}

        </div>
      )}

      {/* SUCCESS */}

      {successId && (

        <div className="mb-4 bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg">

          ✅ Outpass <b>OP-{successId}</b>
          {" "}cancelled successfully

        </div>
      )}

      {/* EMPTY */}

      {activeOutpasses.length === 0 && (

        <div className="text-center text-gray-500 py-10">

          No active outpasses available

        </div>
      )}

      {/* LIST */}

      <div className="space-y-3">

        {activeOutpasses.map((o) => (

          <div
            key={o.id}
            className="flex justify-between items-center border rounded-xl p-4 hover:shadow transition"
          >

            <div>

              <p className="font-medium">

                OP-{o.id}

              </p>

              <p className="text-xs text-gray-500 mt-1">

                {o.outp_status}

              </p>

            </div>

            <button
              onClick={() =>
                setSelectedOutpass(o)
              }
              className="bg-[#6d0f16] text-white px-4 py-2 text-xs rounded-lg"
            >

              View

            </button>

          </div>
        ))}

      </div>

      {/* ================= MODAL ================= */}

      {selectedOutpass && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[550px] rounded-2xl shadow-xl p-6 relative">

            <button
              onClick={() =>
                setSelectedOutpass(null)
              }
              className="absolute top-3 right-4 text-gray-500 hover:text-black"
            >

              ✕

            </button>

            <h3 className="text-lg font-semibold text-[#6d0f16] mb-4">

              Outpass Details

            </h3>

            {/* STATUS */}

            <div className="mb-4">

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium
                ${
                  selectedOutpass.outp_status
                    ?.toLowerCase() ===
                  "approved"
                    ? "bg-green-100 text-green-700"

                    : "bg-yellow-100 text-yellow-700"
                }`}
              >

                {selectedOutpass.outp_status}

              </span>

            </div>

            {/* DETAILS */}

            <div className="grid grid-cols-2 gap-3 text-sm">

              <Detail
                label="ID"
                value={`OP-${selectedOutpass.id}`}
              />

              <Detail
                label="Type"
                value={selectedOutpass.outpass_type}
              />

              <Detail
                label="Place"
                value={selectedOutpass.place_of_visit}
              />

              <Detail
                label="Purpose"
                value={selectedOutpass.purpose}
              />

              <Detail
                label="Departure"
                value={
                  selectedOutpass.departure_datetime
                    ? new Date(
                        selectedOutpass.departure_datetime
                      ).toLocaleString()
                    : "N/A"
                }
              />

              <Detail
                label="Arrival"
                value={
                  selectedOutpass.arrival_datetime
                    ? new Date(
                        selectedOutpass.arrival_datetime
                      ).toLocaleString()
                    : "N/A"
                }
              />

            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() =>
                  setSelectedOutpass(null)
                }
                className="px-4 py-2 border rounded-lg"
              >

                Close

              </button>

              <button
                onClick={() =>
                  setShowConfirm(true)
                }
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-300"
              >

                {loading
                  ? "Cancelling..."
                  : "Cancel Outpass"}

              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= CONFIRM ================= */}

      {showConfirm && (

        <ConfirmModal
          loading={loading}
          onCancel={() =>
            setShowConfirm(false)
          }
          onConfirm={confirmCancel}
        />
      )}

    </div>
  );
}

/* ================= CONFIRM MODAL ================= */

function ConfirmModal({
  onCancel,
  onConfirm,
  loading,
}) {

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
            disabled={loading}
            className="px-4 py-2 border rounded-lg"
          >

            No

          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >

            {loading
              ? "Cancelling..."
              : "Yes Cancel"}

          </button>

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

    <div className="bg-gray-50 border rounded-lg p-3">

      <p className="text-xs text-gray-500">

        {label}

      </p>

      <p className="font-medium text-sm">

        {value || "N/A"}

      </p>

    </div>
  );
}