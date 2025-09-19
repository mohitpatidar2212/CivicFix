import { FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded px-4 py-2 w-1/3"
      />
      <div className="flex items-center gap-4">
        <FaBell className="text-gray-600 text-xl cursor-pointer" />
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserCircle className="text-gray-600 text-2xl" />
          <span className="font-medium">Mohit</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
