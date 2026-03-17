import React from "react";
import BMW from "../assets/images/M2.png";

const Home = () => {
  const featuredCars = [
    {
      id: 1,
      title: "2024 Toyota Camry",
      subtitle: "Sedan • 4 seats • Automatic",
      price: "$28,900",
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
      price: "$36,500",
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
      price: "$42,200",
      specs: [
        { label: "Range", value: "325 miles" },
        { label: "0-60", value: "3.1s" },
        { label: "Drive", value: "AWD" },
      ],
      image:
        "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
        {
      id: 4,
      title: "2024 BMW M340i",
      subtitle: "Sedan • 5 seats • Electric",
      price: "$42,200",
      specs: [
        { label: "Range", value: "325 miles" },
        { label: "0-60", value: "3.1s" },
        { label: "Drive", value: "AWD" },
      ],
      image:
        "BMW",
    },
  ];

  return (
    <div className="space-y-10 md:flex md:space-y-0 md:items-start md:gap-8">
      <aside className="md:w-1/3 space-y-6">
        <header className="rounded-xl bg-transparent p-6">
          <h1 className="text-3xl font-bold">Welcome to AutoHub</h1>
          <p className="mt-3 text-gray-600">
            AutoHub connects buyers, sellers, renters, and approved dealerships in one
            place. Explore our car listings, post vehicles for sale, or rent cars from
            trusted dealerships.
          </p>
        </header>

        <section className="grid gap-6">
          <div className="rounded-xl bg-transparent p-6">
            <h2 className="text-xl font-semibold mb-2">Buy a Car</h2>
            <p className="text-gray-600">
              Browse verified cars available for purchase from trusted dealerships.
            </p>
          </div>
          <div className="rounded-xl bg-transparent p-6">
            <h2 className="text-xl font-semibold mb-2">Rent a Car</h2>
            <p className="text-gray-600">
              Rent a vehicle for as long as you need from dealerships in your area.
            </p>
          </div>
          <div className="rounded-xl bg-transparent p-6">
            <h2 className="text-xl font-semibold mb-2">Sell a Car</h2>
            <p className="text-gray-600">
              List your car through an approved dealership and reach more buyers.
            </p>
          </div>
        </section>
      </aside>

      <main className="md:flex-1">
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Featured Cars</h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Browse a selection of top cars that are currently available.
            </p>
          </div>

          <div className="grid gap-6">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="rounded-xl bg-transparent p-6 flex flex-col gap-4 md:flex-row md:items-center"
              >
                <img
                  src={car.image}
                  alt={car.title}
                  className="h-36 w-full rounded-lg object-cover md:w-48"
                />

                <div className="flex-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{car.title}</h3>
                      <p className="text-sm text-gray-500">{car.subtitle}</p>
                    </div>
                    <span className="text-right text-lg font-bold text-purple-600">
                      {car.price}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-gray-600">
                    {car.specs.map((spec) => (
                      <div key={spec.label} className="flex justify-between">
                        <span className="font-medium text-gray-700">{spec.label}</span>
                        <span>{spec.value}</span>
                      </div>
                    ))}
                  </div>
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
