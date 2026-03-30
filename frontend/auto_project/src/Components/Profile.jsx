import React, { useState } from 'react';
import Sidebar from './Admin/Sidebar'; 

const Profile = () => {
    // 1. Hardcoded User Info (Simulating a logged-in Dealership Admin)
    const [user] = useState({
        id: "7721",
        username: "Ronny_Admin",
        email: "ronny@autohub.com",
        phone_number: "+254 700 000 000",
        role: "DEALERSHIP_ADMIN", // Change to 'USER' to see the other view
        dealership_name: "AutoHub Main Branch",
        is_verified: true,
        created_at: "2026-01-15"
    });

    // 2. Hardcoded Dashboard Stats
    const [stats] = useState({
        totalCars: 24,
        siteUsers: 158,
    });

    // 3. Hardcoded List Data
    const [activeTab, setActiveTab] = useState('overview');
    
    const [myCars] = useState([
        { id: 1, brand: "Toyota", model: "Camry", price: 25000, status: "APPROVED", year: 2022, created_at: "2026-03-01" },
        { id: 2, brand: "BMW", model: "M4", price: 75000, status: "PENDING", year: 2023, created_at: "2026-03-15" }
    ]);

    const [pendingApprovals] = useState([
        { id: 101, brand: "Mercedes", model: "C63", price: 68000, fuel_type: "Petrol", transmission: "Automatic", mileage: "12,000", inspection: true },
        { id: 102, brand: "Nissan", model: "GT-R", price: 110000, fuel_type: "Petrol", transmission: "Dual-Clutch", mileage: "5,500", inspection: false }
    ]);

    return (
        <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-10">
                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Site Users</p>
                        <h2 className="text-3xl font-black mt-2">{stats.siteUsers}</h2>
                        <p className="text-blue-600 text-xs font-bold mt-1">Live Community</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Inventory</p>
                        <h2 className="text-3xl font-black mt-2">{stats.totalCars}</h2>
                        <p className="text-purple-600 text-xs font-bold mt-1">Vehicles Listed</p>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Session</p>
                        <h2 className="text-xl font-bold mt-2 truncate">{user.username}</h2>
                        <p className="text-slate-400 text-xs mt-1">{user.role.replace('_', ' ')}</p>
                    </div>
                </div>

                {/* --- USER PROFILE DATA CARD --- */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
                    {user.is_verified && (
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-blue-600 text-white px-4 py-1 rounded-bl-xl text-[10px] font-black tracking-widest absolute top-0 right-0">VERIFIED</span>
                        </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
                            {user.username[0]}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 w-full">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Username</label>
                                <p className="font-bold text-slate-800">{user.username}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Email Address</label>
                                <p className="font-bold text-slate-800">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Password</label>
                                <p className="font-bold text-slate-300 tracking-widest">••••••••</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Contact</label>
                                <p className="font-bold text-slate-800">{user.phone_number}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Account ID</label>
                                <p className="font-mono text-xs text-slate-500">#{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- NAVIGATION TABS --- */}
                <div className="flex gap-8 border-b border-slate-200 mb-6">
                    <button onClick={() => setActiveTab('overview')} className={`pb-4 text-xs font-black tracking-widest transition-all ${activeTab === 'overview' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>OVERVIEW</button>
                    {user.role === 'USER' && (
                        <button onClick={() => setActiveTab('garage')} className={`pb-4 text-xs font-black tracking-widest transition-all ${activeTab === 'garage' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>MY SUBMISSIONS</button>
                    )}
                    {user.role === 'DEALERSHIP_ADMIN' && (
                        <button onClick={() => setActiveTab('approvals')} className={`pb-4 text-xs font-black tracking-widest transition-all ${activeTab === 'approvals' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>APPROVAL QUEUE</button>
                    )}
                </div>

                {/* --- TAB CONTENT AREA --- */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[300px] p-6 md:p-8">
                    {activeTab === 'overview' && (
                        <div className="animate-fadeIn">
                            <h3 className="text-sm font-black text-slate-900 uppercase mb-4 tracking-widest">Recent Activity</h3>
                            <div className="bg-slate-50 p-10 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                                <p className="text-slate-400 text-sm italic font-medium">No recent system alerts for this account.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'garage' && (
                        <div className="space-y-4">
                            {myCars.map(car => (
                                <div key={car.id} className="flex justify-between items-center p-5 border border-slate-100 rounded-xl bg-white hover:shadow-md transition-shadow">
                                    <div>
                                        <h4 className="font-black text-slate-800 uppercase text-sm">{car.brand} {car.model}</h4>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${car.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{car.status}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900">${car.price.toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{car.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'approvals' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="px-4 pb-2">Vehicle</th>
                                        <th className="px-4 pb-2">Specs</th>
                                        <th className="px-4 pb-2">Inspection</th>
                                        <th className="px-4 pb-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingApprovals.map(car => (
                                        <tr key={car.id} className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 rounded-l-xl">
                                                <p className="font-black text-slate-800 text-xs uppercase">{car.brand} {car.model}</p>
                                                <p className="text-[10px] font-bold text-slate-400">ID: {car.id}</p>
                                            </td>
                                            <td className="p-4 text-xs font-bold text-slate-600">{car.fuel_type} • {car.transmission}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${car.inspection ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {car.inspection ? 'REPORT READY' : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="p-4 rounded-r-xl text-right">
                                                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-indigo-600 transition-all">Review Vehicle</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Profile;