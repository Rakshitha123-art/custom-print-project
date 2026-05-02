import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaGooglePay,
} from "react-icons/fa";

function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
    ${isActive 
      ? "bg-blue-600 text-white shadow" 
      : "text-gray-300 hover:bg-gray-800 hover:text-white"}`;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-5">

        {/* Logo / Title */}
        <h2 className="text-2xl font-bold mb-8 tracking-wide">
          ⚡ Admin Panel
        </h2>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">

          <NavLink to="/admin" end className={linkClass}>
            <FaTachometerAlt /> Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            <FaBoxOpen /> Products
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            <FaShoppingCart /> Orders
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <FaUsers /> Users
          </NavLink>

          <NavLink to="/admin/payments" className={linkClass}>
            <FaGooglePay /> Payments
          </NavLink>

        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            Admin Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Welcome Admin 👋</span>

            {/* Profile circle */}
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;