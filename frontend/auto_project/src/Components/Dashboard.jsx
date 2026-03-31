import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: Search State for the Super Admin
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);
    if (currentUser) fetchData(currentUser);
  }, []);

  const fetchData = async (currentUser) => {
    try {
      setLoading(true);
      if (currentUser.role === 'SUPER_ADMIN') {
        const res = await api.get('/company/registrations/');
        setCompanies(res.data);
      } else if (currentUser.role === 'DEALERSHIP_ADMIN') {
        const [carsRes] = await Promise.all([
          api.get(`/cars/?dealership=${currentUser.dealership}`)
        ]);
        setCars(carsRes.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // - FILTER LOGIC -
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => 
      c.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  if (loading) return <div className="p-10 text-center">Loading System Data...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Control Panel</h1>
        <div className="text-sm font-medium bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
          {user?.role.replace('_', ' ')}
        </div>
      </div>

      {user?.role === 'SUPER_ADMIN' && (
        <div className="space-y-8">
          {/* Search Bar */}
          <div className="max-w-md">
            <input 
              type="text"
              placeholder="Search companies by name..."
              className="w-full p-3 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2"></span> Pending Approvals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.filter(c => c.status === 'PENDING').map(company => (
                <div key={company.id} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 border-l-4 border-l-orange-400">
                  <h3 className="text-lg font-bold">{company.company_name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{company.company_email}</p>
                  <button
                    onClick={() => approveCompany(company.id)}
                    className="w-full py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
                  >
                    Review & Approve
                  </button>
                </div>
              ))}
              {filteredCompanies.filter(c => c.status === 'PENDING').length === 0 && (
                <p className="text-gray-400 italic">No pending applications found.</p>
              )}
            </div>
          </section>
        </div>
      )}

      {user?.role === 'DEALERSHIP_ADMIN' && (
        <div className="space-y-8">
          <h2 className="text-xl font-bold">Your Fleet Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          

             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs uppercase font-bold">Total Cars</p>
                <p className="text-2xl font-black">{cars.length}</p>
             </div>
          </div>
          {}
        </div>
      )}
    </div>
  );
};

export default Dashboard;