import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Mainlayout = () => {
  return (
    <div className="min-h-screen bg-gray-900/80 text-black">
      <Navbar />
      <main className="w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Mainlayout;
