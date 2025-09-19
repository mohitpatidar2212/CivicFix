import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    console.log("saved role is = ",savedRole)
    if (!savedRole) navigate("/login");
    else setRole(savedRole);
  }, [navigate]);

  const citizenLinks = [
    { name: "Profile", href: "/dashboard/profile" },
    { name: "Report Issue", href: "/dashboard/report" },
  ];

  const authorityLinks = [
    { name: "Profile", href: "/dashboard/profile" },
    { name: "Complaints List", href: "/dashboard/complaints" },
    { name: "Resolved Cases", href: "/dashboard/resolved" },
  ];

  const links = role === "authority" ? authorityLinks : citizenLinks;

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 space-y-6 z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {role === "authority" ? "Authority Panel" : "Citizen Panel"}
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-gray-700 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          {links.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-700"
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full mt-4 text-left px-3 py-2 rounded bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Mobile Hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-gray-800 text-white rounded"
        >
          <Menu size={24} />
        </button>

        {/* Main Outlet */}
        <main className="p-6 mt-20 md:mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
