import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // "citizen" or "authority"

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <Navbar type="dashboard" />

      {/* Dashboard Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-6 space-y-6 mt-16">
          <h2 className="text-xl font-bold mb-6">
            {role === "citizen" ? "Citizen Panel" : "Authority Panel"}
          </h2>

          <nav className="space-y-3">
            {role === "citizen" ? (
              <>
                <Link
                  to="/dashboard/profile"
                  className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/report"
                  className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                  Report Issue
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard/profile"
                  className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/complaints"
                  className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                  Complaints
                </Link>
                <Link
                  to="/dashboard/resolved"
                  className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                  Resolved Cases
                </Link>
              </>
            )}

            <Link
              to="/dashboard/analytics"
              className="block px-3 py-2 rounded hover:bg-gray-700"
            >
              Analytics
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-6"
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
