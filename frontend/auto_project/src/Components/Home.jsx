import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import mustang from "../assets/images/mustang.png";

const Home = () => {
  const navigate = useNavigate();
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [brandFilter, setBrandFilter] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const mockCars = [
    {
      id: "m1",
      brand: "Mercedes Benz",
      model: "C-Class",
      year: 2024,
      price: "8500000",
      is_for_rent: false,
      fuel_type: "Petrol",
      transmission: "Automatic",
      mileage: "5000",
      images: [{ image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    },
    {
      id: "m2",
      brand: "MUSTANG",
      model: "GT500",
      year: 2023,
      price: "12000000",
      is_for_rent: false,
      fuel_type: "Diesel",
      transmission: "Automatic",
      mileage: "12000",
      images: [{ image_url: mustang, is_primary: true }]
    },
    {
      id: "m3",
      brand: "Range Rover",
      model: "Vogue",
      year: 2022,
      price: "15000",
      is_for_rent: true,
      rental_price_per_day: "15000",
      fuel_type: "Diesel",
      transmission: "Automatic",
      mileage: "30000",
      images: [{ image_url: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=1000&auto=format&fit=crop", is_primary: true }]
    }
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await api.get("/cars/"); // Hits your Django backend
        if (res.data && res.data.length > 0) {
          setAllCars(res.data);
        } else {
          setAllCars(mockCars); // Fallback to mocks if no cars added yet
        }
      } catch (err) {
        console.error("Backend unreachable, using mock data", err);
        setAllCars(mockCars);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      const title = `${car.brand} ${car.model}`.toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "rent" && car.is_for_rent) ||
        (categoryFilter === "buy" && !car.is_for_rent);

      const matchesBrand = !brandFilter || car.brand.toLowerCase().includes(brandFilter.toLowerCase());
      const matchesMinYear = !minYear || car.year >= parseInt(minYear);
      const matchesMaxYear = !maxYear || car.year <= parseInt(maxYear);
      const matchesMinPrice = !minPrice || parseFloat(car.price) >= parseInt(minPrice);
      const matchesMaxPrice = !maxPrice || parseFloat(car.price) <= parseInt(maxPrice);

      return matchesSearch && matchesCategory && matchesBrand && 
             matchesMinYear && matchesMaxYear && matchesMinPrice && matchesMaxPrice;
    });
  }, [allCars, searchQuery, categoryFilter, brandFilter, minYear, maxYear, minPrice, maxPrice]);

  if (loading) return <div className="p-20 text-center text-white animate-pulse">Loading AutoHub Inventory...</div>;

  return (
    <div className="space-y-10 md:flex md:space-y-0 md:items-start md:gap-8 text-white p-4 bg-white min-h-screen">
      {/* SIDEBAR */}
      <aside className="md:w-1/3 sticky top-4 space-y-6">
        <div className="rounded-2xl bg-gray-900/80 p-6 shadow-2xl backdrop-blur-md border border-white/10">
          <header className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">AutoHub</h1>
            <p className="mt-3 text-white/70 text-sm">Your premium gateway to verified automotive deals.</p>
          </header>

          <section className="grid gap-4">
            {["all", "buy", "rent"].map((cat) => (
              <div
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`cursor-pointer rounded-xl p-4 transition-all border ${
                  categoryFilter === cat ? "bg-purple-600/30 border-purple-500" : "bg-transparent border-white/5 hover:bg-white/5"
                }`}
              >
                <h2 className="text-lg font-semibold capitalize">{cat === "all" ? "All Vehicles" : `${cat} a Car`}</h2>
                <p className="text-xs text-white/60">{cat === "all" ? "View entire collection" : `Options for ${cat}ing`}</p>
              </div>
            ))}
          </section>
        </div>

        {/* ADVANCED FILTERS */}
        <div className="rounded-2xl bg-gray-900/80 p-6 border border-white/10">
           <h3 className="text-sm font-black uppercase tracking-widest text-purple-400 mb-6">Search</h3>
           <div className="space-y-5">
              <input 
                type="text" placeholder="Brand & Model" value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-purple-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Min Year" value={minYear} onChange={(e) => setMinYear(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm" />
                <input type="number" placeholder="Max Year" value={maxYear} onChange={(e) => setMaxYear(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm" />
              </div>
              <button 
                onClick={() => {setBrandFilter(""); setMinYear(""); setMaxYear(""); setMinPrice(""); setMaxPrice("");}}
                className="w-full py-3 rounded-xl border border-white/5 text-xs font-bold text-white hover:bg-white/5 transition-all"
              >CLEAR FILTERS</button>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="md:flex-1">
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gray-900 border border-white/10 p-8 md:p-16 shadow-2xl bg-cover bg-center"
             style={{ backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.6)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920')` }}>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-purple-400 mb-4 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-purple-400"></span>Welcome to AutoHub
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Drive the Future of <br /> <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">Automotive Excellence</span></h1>
            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl">Premium verified vehicles from trusted dealerships.</p>
          </div>
        </div>

        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-semibold capitalize">{categoryFilter} Cars</h2>
            <p className="text-white/60 text-sm">Showing {filteredCars.length} results</p>
          </div>
          <input
            type="text" placeholder="Search make or model..."
            className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 w-64"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => {
            const displayImage = car.images?.[0]?.image_url || "https://via.placeholder.com/400x300";
            return (
              <div key={car.id} className="rounded-2xl bg-gray-900/40 border border-white/5 p-4 flex flex-col hover:border-purple-500 transition-all group">
                <div className="overflow-hidden rounded-xl h-48 mb-4">
                  <img src={displayImage} alt={car.brand} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{car.brand} {car.model}</h3>
                      <p className="text-xs text-purple-300">{car.year}</p>
                    </div>
                    <span className="text-purple-200 font-black">
                      {car.is_for_rent ? `KES ${car.rental_price_per_day}/day` : `KES ${parseInt(car.price).toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* LINK TO CARS PAGE */}
        <div className="mt-12 flex justify-center border-t border-white/5 pt-10">
          <button 
            onClick={() => navigate("/cars")}
            className="group flex items-center gap-3 bg-white/5 border border-white/10 px-10 py-4 rounded-full font-bold hover:bg-purple-600 transition-all"
          >
            EXPLORE FULL INVENTORY
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;