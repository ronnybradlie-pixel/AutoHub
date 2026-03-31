import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/cars/"); 
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) return <div className="text-center mt-10 text-white">Loading AutoHub Listings...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Car Listings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => {
          const primaryImage = car.images?.find(img => img.is_primary) || car.images?.[0];
          
          return (
            <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
              {/* Image Section */}
              <div className="relative h-48 bg-gray-200">
                {primaryImage ? (
                  <img 
                    src={primaryImage.image_url} 
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image Available
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                  {car.year}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-bold text-gray-800">{car.brand} {car.model}</h2>
                <p className="text-sm text-gray-500 line-clamp-1">{car.title}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-black text-purple-700">
                    ${parseFloat(car.price).toLocaleString()}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{car.fuel_type} • {car.transmission}</p>
                  </div>
                </div>

                <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cars.length === 0 && (
        <div className="text-center text-white/60 py-20">
          No cars are currently available. Check back soon!
        </div>
      )}
    </div>
  );
};

export default Cars;