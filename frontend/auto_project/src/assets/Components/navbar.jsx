import { Link } from "react-router-dom";
import logo from "../assets/images/Autohub logo.png";

const Navbar = () => {
  return (
    <nav className="bg-[#C0C0C0] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AutoHub Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold text-[#6D28D9]">AutoHub</span>
        </Link>

        <div className="flex flex-wrap text-gray-800 font-medium gap-4">
          <Link to="/" className="hover:text-purple-700">
            Home
          </Link>
          <Link to="/cars" className="hover:text-purple-700">
            Cars
          </Link>
          <Link to="/rent" className="hover:text-purple-700">
            Rent
          </Link>
          <Link to="/sell" className="hover:text-purple-700">
            Sell
          </Link>
          <Link to="/about" className="hover:text-purple-700">
            About
          </Link>
        </div>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 border border-purple-500 rounded-lg hover:bg-purple-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-[#A78BFA] text-white rounded-lg hover:bg-[#8B5CF6]"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
