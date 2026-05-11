import { useState } from "react";

function Outpass() {
  const [type, setType] = useState("local");
  const [status, setStatus] = useState("idle"); // idle | pending | approved

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("pending");
  };

  const resetForNew = () => {
    setStatus("idle");
    setType("local");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-black text-white rounded-2xl shadow-2xl p-6 md:p-8">
        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            <h1 className="text-3xl font-bold text-center sticky top-0 bg-black py-2">
              🎓 College Outpass System
            </h1>

            <div>
              <label className="block mb-2 text-sm font-semibold">Outpass Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded-lg bg-white text-black"
              >
                <option value="local">Local (Market)</option>
                <option value="outstation">Outstation</option>
              </select>
            </div>

            {type === "outstation" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required className="p-3 rounded-lg bg-white text-black" placeholder="Place of Visit" />
                <input required className="p-3 rounded-lg bg-white text-black" placeholder="Purpose of Visit" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Departure Date & Time</label>
                <input required type="datetime-local" className="w-full p-3 rounded-lg bg-white text-black" />
              </div>
              <div>
                <label className="text-sm">Arrival Date & Time (Optional)</label>
                <input type="datetime-local" className="w-full p-3 rounded-lg bg-white text-black" />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#631012] text-white py-3 rounded-xl font-bold">
              Submit Outpass Request
            </button>
          </form>
        )}

        {status === "pending" && (
          <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[60vh]">
            <div className="text-5xl">⏳</div>
            <h2 className="text-2xl font-bold">Request Sent</h2>
            <p>Your request is waiting for attendant approval.</p>
            <p className="text-sm opacity-80">Please check back later.</p>
          </div>
        )}

        {status === "approved" && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 min-h-[60vh]">
            <div className="text-5xl">✅</div>
            <h2 className="text-2xl font-bold">Outpass Approved</h2>
            <p>You may now proceed.</p>
            <button onClick={resetForNew} className="bg-black text-white px-6 py-3 rounded-xl font-bold">
              Request Another Outpass
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Outpass;
