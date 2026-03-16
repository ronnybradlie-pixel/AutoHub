import React from "react";

const Home = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold">Welcome to AutoHub</h1>
        <p className="mt-2 text-gray-700 max-w-2xl">
          AutoHub connects buyers, sellers, renters, and approved dealerships in one
          place. Explore our car listings, post vehicles for sale, or rent cars from
          trusted dealerships.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Buy a Car</h2>
          <p className="text-gray-600">
            Browse verified cars available for purchase from trusted dealerships.
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Rent a Car</h2>
          <p className="text-gray-600">
            Rent a vehicle for as long as you need from dealerships in your area.
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Sell a Car</h2>
          <p className="text-gray-600">
            List your car through an approved dealership and reach more buyers.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
