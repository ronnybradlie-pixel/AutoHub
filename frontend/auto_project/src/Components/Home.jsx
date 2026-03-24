import React, { useEffect, useState } from "react";

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCars = async () => {
      try {
        const res = await fetch("/api/cars");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        if (mounted) setFeaturedCars(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load cars");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCars();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-10 md:flex md:space-y-0 md:items-start md:gap-8 text-white">
      <aside className="md:w-1/3">
        <div className="rounded-2xl bg-gray-900/80 p-6 shadow-2xl backdrop-blur-md">
        <header className="rounded-xl bg-transparent p-6">
          <h1 className="text-3xl font-bold">Welcome to AutoHub</h1>
          <p className="mt-3 text-white/70">
            AutoHub connects buyers, sellers, renters, and approved dealerships in one
            place. Explore our car listings, post vehicles for sale, or rent cars from
            trusted dealerships.
          </p>
        </header>

        <section className="grid gap-6">
          <div className="rounded-xl bg-transparent p-6">
            <h2 className="text-xl font-semibold mb-2">Buy a Car</h2>
            <p className="text-white/80">
              Browse verified cars available for purchase from trusted dealerships.
            </p>
          </div>
          <div className="rounded-xl bg-transparent p-6">
            <h2 className="text-xl font-semibold mb-2">Rent a Car</h2>
            <p className="text-white/80">
              Rent a vehicle for as long as you need from dealerships in your area.
            </p>
          </div>
          <div className="rounded-xl bg-transparent p-6">
            <h2 className="text-xl font-semibold mb-2">Sell a Car</h2>
            <p className="text-white/80">
              List your car through an approved dealership and reach more buyers.
            </p>
          </div>
        </section>
        </div>
      </aside>

      <main className="md:flex-1">
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Featured Cars</h2>
            <p className="mt-2 text-white/80 max-w-2xl">
              Browse a selection of top cars that are currently available.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="rounded-xl bg-transparent p-8 flex flex-col justify-between gap-6 min-h-[280px]"
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="h-52 w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{car.title}</h3>
                      <p className="text-sm text-white/80">{car.subtitle}</p>
                    </div>
                    <span className="text-right text-lg font-bold text-purple-200">
                      {car.price}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-white/80">
                    {car.specs.map((spec) => (
                      <div key={spec.label} className="flex justify-between">
                        <span className="font-medium text-white">{spec.label}</span>
                        <span>{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <button className="mt-6 self-start rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
