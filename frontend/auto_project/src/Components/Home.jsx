import React from "react";
import BMW from "../assets/images/M2-comp.png";
import porsche from "../assets/images/porsche.png";
import Mustang from "../assets/images/Mustang.png";

const Home = () => {
  const featuredCars = [
    {
      id: 1,
      title: "2024 Toyota Camry",
      subtitle: "Sedan • 4 seats • Automatic",
      price: "ksh 8,900,000",
      specs: [
        { label: "Engine", value: "2.5L I4" },
        { label: "MPG", value: "28 city / 39 hwy" },
        { label: "Transmission", value: "8-speed automatic" },
      ],
      image:
        "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 2,
      title: "2023 Ford Mustang",
      subtitle: "Coupe • 4 seats • Manual",
      price: "ksh36,500,000",
      specs: [
        { label: "Engine", value: "5.0L V8" },
        { label: "MPG", value: "15 city / 24 hwy" },
        { label: "Transmission", value: "6-speed manual" },
      ],
      image:
        "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 3,
      title: "2024 Tesla Model 3",
      subtitle: "Sedan • 5 seats • Electric",
      price: "ksh 62,590,200",
      specs: [
        { label: "Range", value: "325 miles" },
        { label: "Drive", value: "AWD" },
      ],
      image:
        "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
        {
      id: 4,
      title: "2024 BMW M340i",
      subtitle: "Sedan • 5 seats • Electric",
      price: "ksh 42,500,000",
      specs: [
        { label: "Range", value: "325 miles" },
        { label: "Drive", value: "AWD" },
      ],
      image:
        "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

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
