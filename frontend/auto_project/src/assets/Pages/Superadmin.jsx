// pages/Admin/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Admin/Sidebar';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dealerships');
  const [dealerships, setDealerships] = useState([]);
  const [cars, setCars] = useState([]);

  // 1. Fetch Data based on active tab
  useEffect(() => {
    if (activeTab === 'dealerships') {
      axios.get('/api/superadmin/pending_dealerships/').then(res => setDealerships(res.data));
    } else if (activeTab === 'inventory') {
      axios.get('/api/superadmin/all_cars/').then(res => setCars(res.data));
    }
  }, [activeTab]);

  // 2. Handle Dealership Approval/Rejection
  const handleVerify = async (id, action) => {
    try {
      await axios.post(`/api/superadmin/verify_dealership/${id}/`, { action });
      setDealerships(prev => prev.filter(d => d.id !== id));
      alert(`Dealership ${action === 'approve' ? 'Approved' : 'Rejected'}`);
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  // 3. Handle Car Deletion
  const handleDeleteCar = async (id) => {
    if (window.confirm("Delete this inappropriate listing?")) {
      await axios.delete(`/api/cars/${id}/`);
      setCars(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8">
        {activeTab === 'dealerships' ? (
          <section>
            <h2 className="text-2xl font-bold mb-6">Verification Requests</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Dealership</th>
                    <th className="px-6 py-4">License Doc</th>
                    <th className="px-6 py-4">Date Joined</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dealerships.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{d.name}</td>
                      <td className="px-6 py-4 text-blue-500 underline text-sm">
                        <a href={d.license_file_url} target="_blank" rel="noreferrer">View License</a>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(d.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 flex gap-3">
                        <button onClick={() => handleVerify(d.id, 'approve')} className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200">Approve</button>
                        <button onClick={() => handleVerify(d.id, 'reject')} className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dealerships.length === 0 && <p className="p-10 text-center text-gray-400">No pending requests.</p>}
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-2xl font-bold mb-6">Global Inventory Monitor</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cars.map(car => (
                <div key={car.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group">
                  <div className="relative">
                    <img src={car.photo} alt={car.model} className="w-full h-48 object-cover" />
                    <button 
                      onClick={() => handleDeleteCar(car.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >Delete</button>
                    
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{car.make} {car.model}</h3>
                    <p className="text-sm text-gray-500 italic">Posted by: {car.dealership_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;