import React, { useState } from "react";

export default function CreateOutpass({ setOutpasses, setActive }) {
  const [type, setType] = useState("Market");
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (!form.departure || !form.arrival) {
      setError("Please fill all required fields");
      return false;
    }

    if (type === "Home" && (!form.place || !form.purpose)) {
      setError("Please fill Place of Visit and Reason");
      return false;
    }

    setError("");
    return true;
  }

  function submit() {
    if (!validate()) return;

    setOutpasses(prev => [
      ...prev,
      {
        id: prev.length + 1,
        outpass_type: type,
        place_of_visit: type === "Home" ? form.place : "Market",
        purpose: type === "Home" ? form.purpose : "",
        departure_datetime: form.departure,
        arrival_datetime: form.arrival,
        status: "Pending",
      },
    ]);

    setSubmitted(true);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">

      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border shadow">

        <h2 className="text-2xl font-semibold text-center text-[#6d0f16] mb-6">
          Create Outpass
        </h2>

        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* TYPE */}
        <div className="mb-5">
          <label className="text-sm">Outpass Type</label>

          <select
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={type}
            onChange={e => {
              setType(e.target.value);
              setForm({});
              setError("");
            }}
          >
            <option>Market</option>
            <option>Home</option>
          </select>
        </div>

        {/* HOME FIELDS */}
        {type === "Home" && (
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <Input
              label="Place of Visit"
              onChange={v => setForm({ ...form, place: v })}
            />

            <Input
              label="Reason"
              onChange={v => setForm({ ...form, purpose: v })}
            />
          </div>
        )}

        {/* DATE TIME */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Departure"
            type="datetime-local"
            onChange={v => setForm({ ...form, departure: v })}
          />

          <Input
            label="Arrival"
            type="datetime-local"
            onChange={v => setForm({ ...form, arrival: v })}
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={submit}
          className="mt-8 w-full bg-[#6d0f16] hover:bg-[#5a0c12] text-white py-3 rounded-xl font-medium"
        >
          Submit Outpass
        </button>

        {/* SUCCESS POPUP */}
        {submitted && (
          <Success
            setSubmitted={setSubmitted}
            setActive={setActive}
          />
        )}
      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({ label, type = "text", onChange }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-600">{label}</span>

      <input
        type={type}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full border rounded-lg px-3 py-2"
      />
    </label>
  );
}

/* ================= SUCCESS POPUP ================= */

function Success({ setActive, setSubmitted }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

      <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center shadow-xl">

        <div className="text-green-600 text-5xl mb-2">✓</div>

        <h3 className="font-semibold text-lg">
          Outpass Submitted
        </h3>

        <p className="text-sm text-gray-600 mt-1 mb-5">
          Waiting for approval...
        </p>

        {/* GO TO MAIN PAGE */}
        <button
          onClick={() => {
            setSubmitted(false);
            setActive("my"); // 🔥 redirect to My Outpasses
          }}
          className="bg-[#6d0f16] text-white px-5 py-2 rounded-lg w-full"
        >
          Go to My Outpasses
        </button>

      </div>
    </div>
  );
}