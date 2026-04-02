import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Mainlayout = () => {
  return (
    <div className="min-h-screen bg-gray-900/80 text-black">
      <Navbar />
      <main className="w-full px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Mainlayout;
