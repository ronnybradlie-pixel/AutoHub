import React, { useEffect, useState } from "react";
import axios from "axios";

const Buy = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/cars/available_for_sale/"
      );
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuy = async (carId) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/purchases/",
        { car: carId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Car purchased successfully!");
      fetchCars();
    } catch (err) {
      alert(err.response?.data?.error || "Purchase failed");
    }
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Rent a Car</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car.id} className="bg-gray-900 p-4 rounded-xl">
            <img
              src={car.images[0]?.image}
              alt={car.title}
              className="h-40 w-full object-cover rounded"
            />

            <h2 className="text-xl mt-3">{car.title}</h2>

            <p className="text-sm text-gray-400">
              {car.brand} • {car.model} • {car.year}
            </p>

            <p className="text-lg font-bold mt-2">${car.price}</p>

            <button
              onClick={() => handleBuy(car.id)}
              className="mt-3 bg-purple-500 px-4 py-2 rounded"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buy;