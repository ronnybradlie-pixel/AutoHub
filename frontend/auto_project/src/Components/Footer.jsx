import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/Autohublogo.png"; // Matches your Explorer setup

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8 px-6 mt-20 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-tighter">AUTOHUB</span>
          </div>
          <p className="text-white text-sm leading-relaxed">
            Kenya's premier digital showroom for verified luxury and performance vehicles. 
            Drive the future today.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Inventory</h4>
          <ul className="space-y-4 text-sm text-white">
            <li className="hover:text-purple-500 cursor-pointer transition-colors" onClick={() => navigate("/cars")}>All Vehicles</li>
            <li className="hover:text-purple-500 cursor-pointer transition-colors" onClick={() => navigate("/buy")}>Buy a Car</li>
            <li className="hover:text-purple-500 cursor-pointer transition-colors" onClick={() => navigate("/rent")}>Rentals</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Company</h4>
          <ul className="space-y-4 text-sm text-white">
            <li className="hover:text-purple-500 cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-purple-500 cursor-pointer transition-colors">Privacy Policy</li>
            <li className="hover:text-purple-500 cursor-pointer transition-colors">Contact Support</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white text-xs">
          © {new Date().getFullYear()} AutoHub Kenya. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;