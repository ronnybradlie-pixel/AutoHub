import React, { useEffect, useState } from "react";
import api from "../api/axios";
import GMC from "../assets/images/GMC.png";
import mustang from "../assets/images/mustang.png";
import Gti from "../assets/images/Gti.png";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safety Mock Data for immediate visual feedback
  const mockCars = [
  {
      id: "custom-gmc-1",
      brand: "GMC",
      model: "Sierra 1500", 
      year: 2024,
      price: "10500000",
      fuel_type: "Petrol",
      transmission: "Automatic",
      mileage: "0",
      images: [{ image_url: GMC, is_primary: true }]
    },
    {
      id: "m2",
      brand: "MUSTANG",
      model: "GT500",
      year: 2023,
      price: "12000000",
      fuel_type: "Diesel",
      transmission: "Automatic",
      mileage: "12000",
      images: [{ image_url: mustang, is_primary: true }]
    },
    {
      id: "m3",
      brand: "BMW",
      model: "M4 Competition",
      year: 2024,
      price: "15000000",
      fuel_type: "Petrol",
      transmission: "Automatic",
      mileage: "1500",
      images: [{ image_url: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    },
    {
      id: "m1",
      brand: "Mercedes Benz",
      model: "C-Class AMG",
      year: 2024,
      price: "8500000",
      fuel_type: "Petrol",
      transmission: "Automatic",
      mileage: "5000",
      images: [{ image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    },
    {
      id: "m2",
      brand: "volkswagon",
      model: "VW GTI",
      year: 2023,
      price: "12000000",
      fuel_type: "Diesel",
      transmission: "Automatic",
      mileage: "12000",
      images: [{ image_url: Gti, is_primary: true }]
    },
    {
      id: "m3",
      brand: "BMW",
      model: "M4 Competition",
      year: 2024,
      price: "15000000",
      fuel_type: "Petrol",
      transmission: "Automatic",
      mileage: "1500",
      images: [{ image_url: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    },
    {
      id: "m4",
      brand: "Porsche",
      model: "911 Carrera",
      year: 2023,
      price: "22000000",
      fuel_type: "Petrol",
      transmission: "PDK",
      mileage: "2100",
      images: [{ image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    },
    {
      id: "m5",
      brand: "Audi",
      model: "RS7 Sportback",
      year: 2024,
      price: "18500000",
      fuel_type: "Petrol",
      transmission: "Automatic",
      mileage: "500",
      images: [{ image_url: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    },
    {
      id: "m6",
      brand: "Jeep",
      model: "Wrangler Rubicon",
      year: 2022,
      price: "9800000",
      fuel_type: "Petrol",
      transmission: "Manual",
      mileage: "15000",
      images: [{ image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    }
  ];


  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/cars/"); 
        if (response.data && response.data.length > 0) {
          setCars(response.data);
        } else {
          setCars(mockCars);
        }
      } catch (error) {
        console.error("Using mock data as fallback:", error);
        setCars(mockCars);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) return <div className="text-center py-20 text-white animate-pulse text-xl">Loading AutoHub Listings...</div>;

  return (
    <div className="p-6 space-y-10 bg-black min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Available Inventory</h1>
          <p className="text-purple-400 font-medium">Verified Vehicles • Pre-Inspected • Trusted Dealers</p>
        </div>
        <p className="text-gray-500 text-sm italic">Showing {cars.length} vehicles</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => {
          const displayImage = car.images?.find(img => img.is_primary)?.image_url || 
                             car.images?.[0]?.image_url || 
                             "https://via.placeholder.com/400x300";
          
          return (
            <div key={car.id} className="group bg-[#111] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.1)]">
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={displayImage} 
                  alt={car.brand}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                  {car.year}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{car.brand}</h2>
                        <p className="text-sm text-gray-500">{car.model}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-white">KES {parseInt(car.price).toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5">
                    <div className="text-center border-r border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase">Fuel</p>
                        <p className="text-xs font-bold text-gray-300">{car.fuel_type}</p>
                    </div>
                    <div className="text-center border-r border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase">Transmission</p>
                        <p className="text-xs font-bold text-gray-300">{car.transmission}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 uppercase">Mileage</p>
                        <p className="text-xs font-bold text-gray-300">{car.mileage} km</p>
                    </div>
                </div>

                <button className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition-all transform active:scale-95 shadow-lg">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cars.length === 0 && !loading && (
        <div className="text-center text-white/40 py-40 border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-2xl font-light">No cars currently available in the showroom.</p>
          <p className="text-sm mt-2">Check back later or refresh the page.</p>
        </div>
      )}
    </div>
  );
};

export default Cars;