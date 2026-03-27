import React, { useEffect, useState, useMemo } from "react";

const Home = () => {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // New Filter States
  const [brandFilter, setBrandFilter] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchCars = async () => {
      try {
        const res = await fetch("/api/cars");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();

        const formatted = data.map((car) => ({
          id: car.id,
          brand: car.brand,
          year: car.year,
          rawPrice: car.price,
          title: `${car.brand} ${car.model}`,
          subtitle: car.dealership_name || "Verified Dealership",
          image:
            car.photo ||
            car.image ||
            "https://via.placeholder.com/400x300?text=No+Image",
          price: car.is_for_rent
            ? `${car.rental_price_per_day}/day`
            : `$${car.price?.toLocaleString()}`,
          is_for_rent: car.is_for_rent,
          specs: [
            { label: "Year", value: car.year },
            { label: "Type", value: car.is_for_rent ? "Rental" : "For Sale" },
            { label: "Mileage", value: `${car.mileage} km` },
          ],
        }));

        if (mounted) setAllCars(formatted);
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

  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      const matchesSearch = car.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "rent" && car.is_for_rent) ||
        (categoryFilter === "buy" && !car.is_for_rent);

      // Advanced Filter Logic
      const matchesBrand = !brandFilter || car.brand.toLowerCase().includes(brandFilter.toLowerCase());
      const matchesMinYear = !minYear || car.year >= parseInt(minYear);
      const matchesMaxYear = !maxYear || car.year <= parseInt(maxYear);
      const matchesMinPrice = !minPrice || car.rawPrice >= parseInt(minPrice);
      const matchesMaxPrice = !maxPrice || car.rawPrice <= parseInt(maxPrice);

      return matchesSearch && matchesCategory && matchesBrand && 
             matchesMinYear && matchesMaxYear && matchesMinPrice && matchesMaxPrice;
    });
  }, [allCars, searchQuery, categoryFilter, brandFilter, minYear, maxYear, minPrice, maxPrice]);

  if (loading)
    return (
      <div className="p-20 text-center text-white">
        Loading AutoHub Inventory...
      </div>
    );

  return (
    <div className="space-y-10 md:flex md:space-y-0 md:items-start md:gap-8 text-white p-4">
      <aside className="md:w-1/3 sticky top-4 space-y-6">
        {/* Original Sidebar Content */}
        <div className="rounded-2xl bg-gray-900/80 p-6 shadow-2xl backdrop-blur-md border border-white/10">
          <header className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              AutoHub
            </h1>
            <p className="mt-3 text-white/70 text-sm">
              Your premium gateway to verified automotive deals.
            </p>
          </header>

          <section className="grid gap-4">
            <div
              onClick={() => setCategoryFilter("all")}
              className={`cursor-pointer rounded-xl p-4 transition-all border ${
                categoryFilter === "all"
                  ? "bg-purple-600/30 border-purple-500"
                  : "bg-transparent border-white/5 hover:bg-white/5"
              }`}
            >
              <h2 className="text-lg font-semibold">All Vehicles</h2>
              <p className="text-xs text-white/60">View our entire collection.</p>
            </div>

            <div
              onClick={() => setCategoryFilter("buy")}
              className={`cursor-pointer rounded-xl p-4 transition-all border ${
                categoryFilter === "buy"
                  ? "bg-purple-600/30 border-purple-500"
                  : "bg-transparent border-white/5 hover:bg-white/5"
              }`}
            >
              <h2 className="text-lg font-semibold">Buy a Car</h2>
              <p className="text-xs text-white/60">Search for cars to own permanently.</p>
            </div>

            <div
              onClick={() => setCategoryFilter("rent")}
              className={`cursor-pointer rounded-xl p-4 transition-all border ${
                categoryFilter === "rent"
                  ? "bg-purple-600/30 border-purple-500"
                  : "bg-transparent border-white/5 hover:bg-white/5"
              }`}
            >
              <h2 className="text-lg font-semibold">Rent a Car</h2>
              <p className="text-xs text-white/60">Daily and monthly rental options.</p>
            </div>
          </section>
        </div>

        {/* New Advanced Filters Section (Below the Sidebar) */}
        <div className="rounded-2xl bg-gray-900/80 p-6 shadow-2xl backdrop-blur-md border border-white/10">
           <h3 className="text-sm font-black uppercase tracking-widest text-purple-400 mb-6">Refine Search</h3>
           
           <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">Brand & Model</label>
                <input 
                  type="text" 
                  placeholder="e.g. Toyota"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">Min Year</label>
                  <input 
                    type="number" 
                    placeholder="2010"
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">Max Year</label>
                  <input 
                    type="number" 
                    placeholder="2026"
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">Min Price (KES)</label>
                  <input 
                    type="number" 
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white uppercase block mb-2">Max Price (KES)</label>
                  <input 
                    type="number" 
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button 
                onClick={() => {setBrandFilter(""); setMinYear(""); setMaxYear(""); setMinPrice(""); setMaxPrice("");}}
                className="w-full mt-2 py-3 rounded-xl border border-white/5 text-xs font-bold text-white hover:bg-white/5 transition-all"
              >
                CLEAR ALL FILTERS
              </button>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
  <main className="md:flex-1">
   <div 
  className="relative mb-12 overflow-hidden rounded-3xl bg-gray-900 border border-white/10 p-8 md:p-16 shadow-2xl bg-cover bg-center"
  style={{ 
    backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.6)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920')` 
  }}
>

  <div className="absolute -top-24 -right-24 h-64 w-64 bg-purple-600/20 blur-[100px]" />
  <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-blue-600/10 blur-[100px]" />

  <div className="relative z-10 max-w-3xl">
    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-purple-400 mb-4 flex items-center gap-2">
      <span className="w-8 h-[2px] bg-purple-400"></span>
      Welcome to AutoHub
    </h2>
    
    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
      Drive the Future of <br />
      <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
        Automotive Excellence
      </span>
    </h1>

    <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl">
      Whether you are looking to own your dream car permanently or need
      a reliable rental for the weekend, AutoHub connects you with
      pre-inspected, verified vehicles from trusted dealerships.
    </p>

    <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-10 backdrop-blur-md">
       <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
       </span>
       <p className="text-xs font-medium text-white/70">Safety Tip: We value family. Teach kids "No Secrets, Only Surprises."</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex flex-col gap-2 group cursor-default">
        <div className="h-1 w-12 bg-purple-500 rounded-full mb-2 group-hover:w-20 transition-all duration-300" />
        <h3 className="font-bold text-white">Verified Deals</h3>
        <p className="text-xs text-white/40">
          Every vehicle undergoes a strict mechanical inspection.
        </p>
      </div>
      <div className="flex flex-col gap-2 group cursor-default">
        <div className="h-1 w-12 bg-blue-500 rounded-full mb-2 group-hover:w-20 transition-all duration-300" />
        <h3 className="font-bold text-white">Direct Access</h3>
        <p className="text-xs text-white/40">
          Seamless communication with verified dealership admins.
        </p>
      </div>
      <div className="flex flex-col gap-2 group cursor-default">
        <div className="h-1 w-12 bg-purple-400 rounded-full mb-2 group-hover:w-20 transition-all duration-300" />
        <h3 className="font-bold text-white">Flexible Terms</h3>
        <p className="text-xs text-white/40">
          Daily rentals or full ownership—plans that fit your lifestyle.
        </p>
      </div>
    </div>
  </div>
</div>

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold capitalize">
              {categoryFilter} Cars
            </h2>
            <p className="text-white/60 text-sm">
              Showing {filteredCars.length} results
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search make or model..."
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="rounded-2xl bg-gray-900/40 border border-white/5 p-4 flex flex-col hover:border-purple-500/50 transition-all group shadow-lg"
            >
              <div className="overflow-hidden rounded-xl h-48 mb-4">
                <img
                  src={car.image}
                  alt={car.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{car.title}</h3>
                    <p className="text-xs text-purple-300">{car.subtitle}</p>
                  </div>
                  <span className="text-purple-200 font-black">{car.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-4 border-t border-white/5 mt-auto">
                  {car.specs.map((spec) => (
                    <div key={spec.label} className="flex flex-col">
                      <span className="text-[10px] uppercase text-white/40">
                        {spec.label}
                      </span>
                      <span className="text-sm font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full rounded-xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20 transition-all active:scale-95">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-dashed border-white/10">
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;