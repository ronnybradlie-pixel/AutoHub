import { Link } from "react-router-dom";
import logo from "../assets/images/Autohublogo.png";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AutoHub Logo" className="h-32 w-40 object-contain my-2" />
          <span className="text-xl font-bold text-[#6D28D9]">AutoHub</span>
        </Link>

        <div className="flex flex-wrap text-purple-800 font-medium gap-4">
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
            className="px-4 py-2 border border-purple-500 text-black rounded-lg hover:bg-purple-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-[#A78BFA] text-purple-200 rounded-lg hover:bg-[#8B5CF6]"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
