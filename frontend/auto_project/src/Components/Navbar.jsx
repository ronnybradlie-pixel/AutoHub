import { Link } from "react-router-dom";
import logo from "../assets/images/Autohublogo.png";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Changed max-w to be larger and added px-6 for margin spacing */}
      <div className="max-w-[1440px] mx-auto px-6 flex flex-wrap justify-between items-center">
        
        {/* Logo Section - Stays at the start (left margin) */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AutoHub Logo" className="h-24 w-32 object-contain my-2" />
          <span className="text-xl font-bold text-[#6D28D9]">AutoHub</span>
        </Link>

        {/* Right Side Container - Groups links and buttons to the far end (right margin) */}
        <div className="flex items-center gap-10">
          
          {/* Navigation Links */}
          <div className="hidden md:flex flex-wrap text-purple-800 font-medium gap-8">
            <Link to="/" className="hover:text-purple-700 transition-colors">
              Home
            </Link>
            <Link to="/cars" className="hover:text-purple-700 transition-colors">
              Cars
            </Link>
            <Link to="/buy" className="hover:text-purple-700 transition-colors">
              Buy
            </Link>
            <Link to="/about" className="hover:text-purple-700 transition-colors">
              About
            </Link>
            <Link to="/profile" className="hover:text-purple-700 transition-colors">
              Profile
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2 border border-purple-500 text-black rounded-lg hover:bg-purple-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 bg-[#A78BFA] text-white rounded-lg hover:bg-[#8B5CF6] transition-all shadow-md"
            >
              Register
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;