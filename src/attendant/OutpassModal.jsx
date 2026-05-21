import React from "react";

import DetailCard from "./DetailCard";

export default function OutpassModal({
  outpass,
  onClose,
}) {

  /* ================= PRINT ================= */

  function printPDF() {

    const w =
      window.open(
        "",
        "_blank"
      );

    w.document.write(`
      <html>
        <head>
          <title>Outpass ${outpass.id}</title>

          <style>
            body {
              font-family: Arial;
              padding: 30px;
              color: #222;
            }

            h1 {
              color: #6d0f16;
              margin-bottom: 20px;
            }

            .card {
              border: 1px solid #ddd;
              border-radius: 10px;
              padding: 15px;
              margin-bottom: 12px;
            }

            .label {
              font-size: 12px;
              color: gray;
              margin-bottom: 5px;
            }

            .value {
              font-size: 16px;
              font-weight: bold;
            }
          </style>

        </head>

        <body onload="window.print();window.close()">

          <h1>
            Hostel Outpass
          </h1>

          <div class="card">
            <div class="label">Student Name</div>
            <div class="value">
              ${outpass.student_name || "-"}
            </div>
          </div>

          <div class="card">
            <div class="label">Room</div>
            <div class="value">
              ${outpass.room_no || outpass.room || "-"}
            </div>
          </div>

          <div class="card">
            <div class="label">Type</div>
            <div class="value">
              ${outpass.outpass_type || "-"}
            </div>
          </div>

          <div class="card">
            <div class="label">Place</div>
            <div class="value">
              ${outpass.place_of_visit || "-"}
            </div>
          </div>

          <div class="card">
            <div class="label">Purpose</div>
            <div class="value">
              ${outpass.purpose || "-"}
            </div>
          </div>

          <div class="card">
            <div class="label">Departure</div>
            <div class="value">
              ${
                outpass.departure_datetime
                  ? new Date(
                      outpass.departure_datetime
                    ).toLocaleString("en-IN")
                  : "-"
              }
            </div>
          </div>

          <div class="card">
            <div class="label">Arrival</div>
            <div class="value">
              ${
                outpass.arrival_datetime
                  ? new Date(
                      outpass.arrival_datetime
                    ).toLocaleString("en-IN")
                  : "-"
              }
            </div>
          </div>

          <div class="card">
            <div class="label">Status</div>
            <div class="value">
              ${outpass.outp_status || "-"}
            </div>
          </div>

        </body>
      </html>
    `);

    w.document.close();
  }

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between px-6 py-5 border-b bg-[#6d0f16] text-white">

          <div>

            <h2 className="text-2xl font-bold">

              Outpass Details

            </h2>

            <p className="text-sm text-white/70 mt-1">

              OP-
              {String(
                outpass.id
              ).padStart(4, "0")}

            </p>

          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl"
          >

            ✕

          </button>

        </div>

        {/* ================= BODY ================= */}

        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <DetailCard
              label="Student Name"
              value={
                outpass.student_name
              }
            />

            <DetailCard
              label="Room"
              value={
                outpass.room_no ||
                outpass.room
              }
            />

            <DetailCard
              label="Type"
              value={
                outpass.outpass_type
              }
            />

            <DetailCard
              label="Place"
              value={
                outpass.place_of_visit
              }
              type={
                outpass.outpass_type
              }
              field="place"
            />

            <DetailCard
              label="Purpose"
              value={
                outpass.purpose
              }
              field="purpose"
            />

            <DetailCard
              label="Departure"
              value={
                outpass.departure_datetime
              }
              field="departure"
            />

            <DetailCard
              label="Arrival"
              value={
                outpass.arrival_datetime
              }
              field="arrival"
            />

            <DetailCard
              label="Status"
              value={
                outpass.outp_status
              }
              field="status"
            />

            <DetailCard
              label="Parent Contact"
              value={
                outpass.parent_contact
              }
            />

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">

          <button
            onClick={onClose}
            className="px-5 py-2.5 border rounded-xl hover:bg-gray-100 transition"
          >

            Close

          </button>

          <button
            onClick={printPDF}
            className="px-5 py-2.5 bg-[#6d0f16] hover:bg-[#560c12] text-white rounded-xl transition"
          >

            Print / PDF

          </button>

        </div>

      </div>

    </div>
  );
}