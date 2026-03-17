import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

const Mainlayout = () => {
  return (
    <div className="min-h-screen bg-[#000080]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Wrap the routed content (Outlet children) in a container */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AutoHub. Built for buying, selling, and renting cars.
        </div>
      </footer>
    </div>
  );
};

export default Mainlayout;
