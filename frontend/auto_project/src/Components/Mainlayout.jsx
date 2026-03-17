import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

const Mainlayout = () => {
  return (
    <div className="min-h-screen bg-[#000080] text-white">
      <Navbar />
      <main className="w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Mainlayout;
