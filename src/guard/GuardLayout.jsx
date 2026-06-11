import {
  NavLink,
  Outlet,
} from "react-router-dom";

export default function GuardLayout() {

  /* ================= LOGOUT ================= */

  function handleLogout() {

    localStorage.clear();

    window.location.href =
      "/signin";
  }

  return (

    <div className="min-h-screen flex bg-[#f6f7fb]">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-72 bg-gradient-to-b from-[#6d0f16] to-[#3f0a0f] text-white flex flex-col shadow-2xl sticky top-0 h-screen">

        {/* TOP */}

        <div className="px-6 py-7 border-b border-white/10">

          <h1 className="text-3xl font-bold">

            Guard Panel

          </h1>

          <p className="text-sm text-white/70 mt-2 leading-relaxed">

            Hostel Exit & Return Management System

          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

          <NavItem
            to="/guard/dashboard"
            label="Dashboard"
            icon="📊"
          />

          <NavItem
            to="/guard/exit"
            label="Exit Students"
            icon="🚪"
          />

          <NavItem
            to="/guard/return"
            label="Return Students"
            icon="🔄"
          />

        </nav>

        {/* FOOTER */}

        <div className="p-5 border-t border-white/10 space-y-4">

          {/* INSTRUCTIONS */}

          <div className="bg-white/10 rounded-2xl p-4">

            <h3 className="font-semibold text-sm">

              Guard Instructions

            </h3>

            <ul className="mt-3 text-xs text-white/75 space-y-2 leading-relaxed">

              <li>
                • Verify approved outpass before exit
              </li>

              <li>
                • Confirm student identity carefully
              </li>

              <li>
                • Record return timings accurately
              </li>

              <li>
                • Ensure hostel discipline and safety
              </li>

            </ul>

          </div>

          {/* GUARD INFO */}

          <div className="bg-white/10 rounded-2xl p-4 text-sm">

            <p className="text-white/70">

              Logged in as

            </p>

            <p className="font-semibold mt-1">

              Security Guard

            </p>

            <p className="text-xs text-white/60 mt-1">

              Active Monitoring Session

            </p>

          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="w-full bg-white text-[#6d0f16] font-semibold py-3 rounded-2xl hover:bg-gray-100 transition"
          >

            Logout

          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 overflow-y-auto min-w-0">

        {/* TOPBAR */}

        <div className="bg-white border-b px-8 py-5 flex items-center justify-between sticky top-0 z-10">

          <div>

            <h2 className="text-2xl font-bold text-[#6d0f16]">

              Hostel Security Management

            </h2>

            <p className="text-sm text-gray-500 mt-1">

              Monitor student movement and outpass verification

            </p>

          </div>

          {/* USER */}

          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="font-semibold text-sm">

                Security Guard

              </p>

              <p className="text-xs text-gray-500">

                Hostel Gate Monitoring

              </p>

            </div>

            <div className="w-12 h-12 rounded-full bg-[#6d0f16] text-white flex items-center justify-center font-bold text-lg shadow-md">

              G

            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}

        <div className="p-8">

          <div className="bg-white rounded-3xl border shadow-sm min-h-[calc(100vh-170px)] p-6 overflow-x-auto">

            <Outlet />

          </div>

        </div>

      </main>

    </div>
  );
}

/* ================= NAV ITEM ================= */

function NavItem({
  to,
  label,
  icon,
}) {

  return (

    <NavLink
      to={to}
      className={({ isActive }) =>

        `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200
        ${
          isActive

            ? "bg-white text-[#6d0f16] shadow-lg scale-[1.02]"

            : "text-white/85 hover:bg-white/10 hover:text-white"
        }`
      }
    >

      <span className="text-lg">

        {icon}

      </span>

      <span>

        {label}

      </span>

    </NavLink>
  );
}