import { link} from "react-router-dom";
import logo from "../assets/images/Autohub logo.png";

const Navbar = () => {
    return (
        <nav className="bg-[#C0C0C0] shadow-md">
            <div className="max-w-7x1 mx-auto px-4 py-3 flex justify-between items-center">

        <link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AutoHub Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold text-[#6D28D9]">AutoHub</span>
        </link> 

        <div className="flex text-gray-800 font-medium gap-6">
            <link to="/">Home</link>
            <link to="/Cars">Cars</link>
            <link to="/Rent">Rent</link>
            <link to="/Sell">Sell</link>
            <link to="/about">About</link>
        </div>

        <div className="flex gap-3">
          <link
            to="/login"
            className="px-4 py-2 border border-purple-500 rounded-lg hover:bg-purple-100"
          >
            Login
          </link>

          <link
            to="/register"
            className="px-4 py-2 bg-[#A78BFA] text-white rounded-lg hover:bg-[#8B5CF6]"
          >
            Register
          </link>
        </div>

            </div>
        </nav>
    );
};
