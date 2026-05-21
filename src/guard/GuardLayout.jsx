import { NavLink, Outlet } from "react-router-dom";

export default function GuardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#6d0f16] text-white flex flex-col shadow-lg">

        {/* TITLE */}
        <div className="px-5 py-4 text-xl font-bold border-b border-white/20">
          Guard Panel
        </div>

        {/* NAV */}
        <nav className="p-3 space-y-2">

          <NavItem to="/guard/dashboard" label="Dashboard" />
          <NavItem to="/guard/exit" label="Exit Students" />
          <NavItem to="/guard/return" label="Return Students" />

        </nav>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm border p-5 min-h-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

/* NAV ITEM */
function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-3 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-white text-[#6d0f16] shadow"
            : "hover:bg-white/10 text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}