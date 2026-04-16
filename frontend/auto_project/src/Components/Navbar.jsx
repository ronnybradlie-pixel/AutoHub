import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Components/AuthContext";
import logo from "../assets/images/Autohublogo.png";


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AutoHub Logo" className="h-20 w-28 object-contain" />
          <span className="text-xl font-bold text-[#6D28D9]">AutoHub</span>
        </Link>

        <div className="flex items-center gap-8">
          {/* Main Nav Links */}
          <div className="hidden md:flex text-purple-800 font-medium gap-8">
            <Link to="/" className="hover:text-purple-700">Home</Link>
            <Link to="/cars" className="hover:text-purple-700">Cars</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* "Sell a Car" Dropdown */}
                <div className="bg-[#2D2D2D] text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer">
                  <span>Sell a Car</span>
                  {/* <ChevronDown size={16} /> */}
                </div>

                {/* Profile Pill (From your photo) */}
                <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                   <div className="bg-gray-400 rounded-full p-1 text-white">
                      {/* <UserCircle size={24} /> */}
                   </div>
                   <span className="font-bold text-gray-700 uppercase tracking-tight">
                     {user.username}
                   </span>
                   {/* <ChevronDown size={16} className="text-gray-500" /> */}
                </div>
                
                <button onClick={logout} className="text-xs text-red-500 hover:underline">
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/register"
                className="px-5 py-2 bg-[#A78BFA] text-white rounded-lg hover:bg-[#8B5CF6] transition-all"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;