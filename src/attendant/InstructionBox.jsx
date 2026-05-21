import React from "react";

export default function InstructionBox({
  role = "attendant",
}) {

  /* ================= ROLE RULES ================= */

  const instructions = {

    attendant: [
      "Verify student identity before approval",
      "Check departure and arrival timings carefully",
      "Reject invalid or suspicious requests",
      "Ensure hostel rules are followed strictly",
    ],

    guard: [
      "Verify approved outpass before allowing exit",
      "Record student entry and exit properly",
      "Report late returns immediately",
      "Do not allow unauthorized movement",
    ],

    student: [
      "Return before the approved arrival time",
      "Carry hostel ID card while outside",
      "Multiple violations may lead to restrictions",
      "Use genuine reasons while applying",
    ],
  };

  const currentInstructions =
    instructions[role] ||
    instructions.student;

  /* ================= COLORS ================= */

  const roleStyles = {

    attendant:
      "border-[#6d0f16]/20 bg-[#fff7f7] text-[#6d0f16]",

    guard:
      "border-blue-200 bg-blue-50 text-blue-700",

    student:
      "border-green-200 bg-green-50 text-green-700",
  };

  return (

    <div
      className={`mb-6 border rounded-2xl p-5 shadow-sm ${roleStyles[role]}`}
    >

      {/* HEADER */}

      <div className="flex items-center gap-2 mb-4">

        <div className="text-xl">

          {role === "attendant"
            ? "🛡️"
            : role === "guard"
            ? "🚪"
            : "🎓"}

        </div>

        <h2 className="font-bold text-lg">

          Instructions

        </h2>

      </div>

      {/* LIST */}

      <ul className="space-y-2 text-sm list-disc ml-5">

        {currentInstructions.map(
          (item, index) => (

            <li key={index}>

              {item}

            </li>
          )
        )}

      </ul>

    </div>
  );
}