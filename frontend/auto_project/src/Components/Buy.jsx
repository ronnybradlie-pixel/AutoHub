import React, { useEffect, useState } from "react";
import api from "../api/axios";
import mustang from "../assets/images/mustang.png";

const Buy = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // High-quality mock data to see images immediately
  const mockCars = [
    {
      id: "mock1",
      brand: "Mercedes Benz",
      model: "C-Class AMG",
      year: 2024,
      price: "8500000",
      fuel_type: "Petrol",
      transmission: "Automatic",
      mileage: "5,000",
      images: [{ image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    },
    {
      id: "mock2",
      brand: "MUSTANG",
      model: "GT500",
      year: 2023,
      price: "12000000",
      fuel_type: "Diesel",
      transmission: "Automatic",
      mileage: "12,000",
      images: [{ image_url: mustang, is_primary: true }]
    },
    {
      id: "mock3",
      brand: "BMW",
      model: "M4 Competition",
      year: 2024,
      price: "15000000",
      fuel_type: "Petrol",
      transmission: "Automatic",
      mileage: "1,500",
      images: [{ image_url: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    }
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/cars/"); 
        // If your backend is empty, show the mock cars so the UI isn't blank
        if (response.data && response.data.length > 0) {
          setCars(response.data);
        } else {
          setCars(mockCars);
        }
      } catch (error) {
        console.error("Backend unreachable, showing mock cars for UI testing.");
        setCars(mockCars);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="flex bg-[#0a0a0a] min-h-screen text-white p-6 gap-8">
      {/* Sidebar - Refine Search */}
      <div className="w-1/4 space-y-6 bg-[#161616] p-6 rounded-2xl border border-gray-800 h-fit">
        <h2 className="text-purple-500 font-bold uppercase tracking-wider text-sm">Search</h2>
        {/* ... (Your existing filter inputs like Brand, Min Year, etc. go here) ... */}
      </div>

      {/* Main Content - Car Display */}
      <div className="flex-1">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">All Cars</h1>
            <p className="text-gray-400">Showing {cars.length} premium vehicles</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search make or model..." 
              className="bg-[#161616] border border-gray-800 rounded-lg px-4 py-2 w-64 focus:border-purple-500 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => {
              const displayImage = car.images?.[0]?.image_url;

              return (
                <div key={car.id} className="group bg-[#161616] rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300">
                  {/* Image wrapper with zoom effect */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img 
                      src={displayImage} 
                      alt={car.brand} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                      {car.year}
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{car.brand}</h3>
                      <p className="text-gray-400 text-sm">{car.model}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-purple-400">
                        KES {parseInt(car.price).toLocaleString()}
                      </span>
                      <div className="flex gap-2">
                         <span className="text-[10px] uppercase bg-gray-800 px-2 py-1 rounded text-gray-300">{car.fuel_type}</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Buy;