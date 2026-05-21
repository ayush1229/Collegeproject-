import React, { useState } from "react";

export default function CreateOutpass({
  setActive,
  fetchOutpasses,
}) {

  const [type, setType] =
    useState("local");

  const [form, setForm] =
    useState({
      place: "",
      purpose: "",
      departure: "",
      arrival: "",
      parent_contact: "",
    });

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* ================= VALIDATION ================= */

  function validate() {

    if (
      !form.departure ||
      !form.arrival ||
      !form.parent_contact
    ) {

      setError(
        "Please fill all required fields"
      );

      return false;
    }

    /* PURPOSE REQUIRED */

    if (!form.purpose) {

      setError(
        "Please enter purpose"
      );

      return false;
    }

    /* OUTSTATION PLACE */

    if (
      type === "outstation" &&
      !form.place
    ) {

      setError(
        "Please fill Place of Visit"
      );

      return false;
    }

    setError("");

    return true;
  }

  /* ================= SUBMIT ================= */

  async function submit() {

    if (!validate()) return;

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
        "http://localhost:5000/api/outpasses/create",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            token,
            role,
          },

          body: JSON.stringify({

            outpass_type: type,

            place_of_visit:
              type === "outstation"
                ? form.place
                : "Local Area",

            purpose:
              form.purpose,

            departure_datetime:
              form.departure,

            arrival_datetime:
              form.arrival,

            parent_contact:
              form.parent_contact,
          }),
        }
      );

      const data =
        await response.json();

      console.log(data);

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to create outpass"
        );
      }

      /* REFRESH */

      if (fetchOutpasses) {

        await fetchOutpasses();
      }

      /* RESET */

      setForm({
        place: "",
        purpose: "",
        departure: "",
        arrival: "",
        parent_contact: "",
      });

      setSubmitted(true);

    } catch (err) {

      console.log(err);

      setError(err.message);

    } finally {

      setLoading(false);
    }
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

          <label className="text-sm">

            Outpass Type

          </label>

          <select
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={type}
            onChange={(e) => {

              setType(e.target.value);

              setForm({
                place: "",
                purpose: "",
                departure: "",
                arrival: "",
                parent_contact: "",
              });

              setError("");
            }}
          >

            <option value="local">
              Local
            </option>

            <option value="outstation">
              Outstation
            </option>

          </select>

        </div>

        {/* PURPOSE */}

        <div className="mb-5">

          <Input
            label="Purpose"
            value={form.purpose}
            onChange={(v) =>
              setForm({
                ...form,
                purpose: v,
              })
            }
          />

        </div>

        {/* OUTSTATION EXTRA FIELD */}

        {type === "outstation" && (

          <div className="mb-5">

            <Input
              label="Place of Visit"
              value={form.place}
              onChange={(v) =>
                setForm({
                  ...form,
                  place: v,
                })
              }
            />

          </div>
        )}

        {/* PARENT CONTACT */}

        <div className="mb-5">

          <Input
            label="Parent Contact"
            value={form.parent_contact}
            onChange={(v) =>
              setForm({
                ...form,
                parent_contact: v,
              })
            }
          />

        </div>

        {/* DATE TIME */}

        <div className="grid md:grid-cols-2 gap-4">

          <Input
            label="Departure"
            type="datetime-local"
            value={form.departure}
            onChange={(v) =>
              setForm({
                ...form,
                departure: v,
              })
            }
          />

          <Input
            label="Arrival"
            type="datetime-local"
            value={form.arrival}
            onChange={(v) =>
              setForm({
                ...form,
                arrival: v,
              })
            }
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={submit}
          disabled={loading}
          className="mt-8 w-full bg-[#6d0f16] hover:bg-[#5a0c12] text-white py-3 rounded-xl font-medium disabled:opacity-50"
        >

          {loading
            ? "Submitting..."
            : "Submit Outpass"}

        </button>

        {/* SUCCESS */}

        {submitted && (

          <Success
            setSubmitted={
              setSubmitted
            }
            setActive={
              setActive
            }
          />
        )}

      </div>

    </div>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  type = "text",
  value,
  onChange,
}) {

  return (

    <label className="block">

      <span className="text-sm text-gray-600">

        {label}

      </span>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="mt-1 w-full border rounded-lg px-3 py-2"
      />

    </label>
  );
}

/* ================= SUCCESS ================= */

function Success({
  setActive,
  setSubmitted,
}) {

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

      <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center shadow-xl">

        <div className="text-green-600 text-5xl mb-2">

          ✓

        </div>

        <h3 className="font-semibold text-lg">

          Outpass Submitted

        </h3>

        <p className="text-sm text-gray-600 mt-1 mb-5">

          Waiting for approval...

        </p>

        <button
          onClick={() => {

            setSubmitted(false);

            setActive("my");
          }}
          className="bg-[#6d0f16] text-white px-5 py-2 rounded-lg w-full"
        >

          Go to My Outpasses

        </button>

      </div>

    </div>
  );
}