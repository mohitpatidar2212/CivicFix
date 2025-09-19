import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedName = localStorage.getItem("name");
    if (savedRole) setRole(savedRole);
    if (savedName) setName(savedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const navLinks = role
    ? [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard/analytics" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Services", href: "/#services" },
        { name: "Projects", href: "/#projects" },
        { name: "About", href: "/#about" },
        { name: "Contact", href: "/#contact" },
      ];

  return (
    <header className="backdrop-blur-md bg-white/80 shadow-md fixed w-full z-50">
      <div className="container mx-auto relative flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          CivicFix
        </Link>

        {/* Centered Welcome Message */}
        {role && (
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <p className="text-lg font-semibold text-gray-700 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent animate-pulse">
              Welcome Back! {name}
            </p>
          </div>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="relative group hover:text-blue-600 transition font-medium"
            >
              {item.name}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
          ))}
          {role ? (
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 px-4 py-2 rounded-lg shadow hover:shadow-lg transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg shadow hover:shadow-lg transition"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 top-full flex flex-col items-start px-6 py-4 space-y-4 z-40">
          {role && (
            <p className="text-base font-medium text-gray-700 border-b pb-2 w-full">
              👋 Welcome Back! {name}
            </p>
          )}
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600 transition"
            >
              {item.name}
            </Link>
          ))}
          {role ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-white bg-red-500 px-4 py-2 rounded-lg shadow hover:shadow-lg transition w-full text-left"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg shadow hover:shadow-lg transition w-full text-left"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
