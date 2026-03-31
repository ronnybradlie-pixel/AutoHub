import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Admin/Sidebar'; 

const Profile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [myCars, setMyCars] = useState([]);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // New state for Dashboard Statistics
    const [stats, setStats] = useState({
        totalCars: 0,
        siteUsers: 0,
        dealershipName: "AutoHub Partner"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get('/api/auth/user/');
                setUser(userRes.data);

                // Fetch Stats (Adjust endpoints to match your Django views)
                const statsRes = await axios.get('/api/dashboard/stats/'); 
                setStats(statsRes.data);

                if (userRes.data.role === 'DEALERSHIP_ADMIN') {
                    fetchPendingForDealership(userRes.data.dealership);
                }
                if (userRes.data.role === 'USER') {
                    fetchUserCars();
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Initialization error", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchUserCars = () => {
        axios.get('/api/cars/my-submissions/').then(res => setMyCars(res.data));
    };

    const fetchPendingForDealership = (dealershipId) => {
        axios.get(`/api/cars/?dealership=${dealershipId}&status=PENDING`).then(res => setPendingApprovals(res.data));
    };

    if (loading) return <div className="p-10 text-center font-mono">INITIALIZING AUTOHUB...</div>;

    return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-10">
                {/* 1. TOP STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Users</p>
                    <h2 className="text-3xl font-black mt-2">{stats.siteUsers}</h2>
                    <p className="text-blue-600 text-xs font-bold mt-1">Active on AutoHub</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Inventory</p>
                    <h2 className="text-3xl font-black mt-2">{stats.totalCars}</h2>
                    <p className="text-purple-600 text-xs font-bold mt-1">Total Vehicles Listed</p>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Status</p>
                        <h2 className="text-xl font-bold mt-2 truncate">{user.role.replace('_', ' ')}</h2>
                        <p className="text-slate-400 text-xs mt-1">{user.dealership_name || 'Individual Account'}</p>
                </div>
            </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        {user.is_verified && (
                            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-black tracking-tighter">VERIFIED ADMIN</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 bg-gradient-to-tr from-slate-800 to-slate-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-xl rotate-3">
                            {user.username[0].toUpperCase()}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12 w-full">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase">Username</label>
                                <p className="font-bold text-lg">{user.username}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase">Email Address</label>
                                <p className="font-bold text-lg">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase">Phone</label>
                                <p className="font-bold text-lg">{user.phone_number || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase">Password</label>
                                <p className="font-bold text-slate-400">••••••••••••</p>
                                <button className="text-blue-600 text-[10px] font-black uppercase hover:underline">Change Password</button>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase">Account ID</label>
                                <p className="font-mono text-xs text-slate-500">#{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. TABS NAVIGATION */}
                <div className="flex gap-8 border-b border-slate-200 mb-6">
                    <button onClick={() => setActiveTab('overview')} className={`pb-4 text-sm font-black tracking-widest ${activeTab === 'overview' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>OVERVIEW</button>
                    {user.role === 'USER' && (
                        <button onClick={() => setActiveTab('garage')} className={`pb-4 text-sm font-black tracking-widest ${activeTab === 'garage' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>MY GARAGE</button>
                    )}
                    {user.role === 'DEALERSHIP_ADMIN' && (
                        <button onClick={() => setActiveTab('approvals')} className={`pb-4 text-sm font-black tracking-widest ${activeTab === 'approvals' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>APPROVAL QUEUE</button>
                    )}
                </div>

                {/* 4. TAB CONTENT */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[400px]">
                    {activeTab === 'overview' && (
                        <div className="p-8">
                            <h3 className="text-sm font-black text-slate-900 uppercase mb-6 tracking-widest">Recent Activity</h3>
                            <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 text-center">
                                <p className="text-slate-500 text-sm italic">Detailed system logs will appear here based on your dealership interactions.</p>
                            </div>
                        </div>
                    )}

        {activeTab === 'garage' && (
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black uppercase">Your Submissions</h2>
                    <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full">{myCars.length} Vehicles</span>
                </div>
                    <div className="grid gap-4">
                        {myCars.map(car => (
                        <div key={car.id} className="group flex justify-between items-center p-5 border border-slate-100 rounded-xl hover:border-blue-500 transition-all bg-white hover:shadow-md">
                            <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400">CAR</div>
                            <div>
                                <h4 className="font-black text-slate-800">{car.brand} {car.model}</h4>
                                    <div className="flex gap-2 items-center">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${car.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                       {car.status}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{car.year}</span>
                                    </div>
                            </div>
                                </div>
                                    <div className="text-right">
                                    <p className="font-black text-slate-900 text-lg">${car.price.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(car.created_at).toDateString()}</p>
                                    </div>
                        </div>
                ))}
                    </div>
            </div>
        )}

        {activeTab === 'approvals' && (
            <div className="p-8">
                <h2 className="text-xl font-black uppercase mb-8">Incoming Inspection Requests</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-4">Vehicle Detail</th>
                    <th className="px-4">Specifications</th>
                    <th className="px-4">Status</th>
                    <th className="px-4 text-right">Action</th>
                    </tr>
                </thead>
                    <tbody>
                        {pendingApprovals.map(car => (
                        <tr key={car.id} className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <td className="p-4 rounded-l-xl border-y border-l border-slate-100">
                            <p className="font-black text-slate-800 uppercase">{car.brand} {car.model}</p>
                            <p className="text-[10px] font-bold text-slate-400">REF ID: {car.id}</p>
                        </td>
                        <td className="p-4 border-y border-slate-100">
                            <p className="text-xs font-bold text-slate-600">{car.fuel_type} • {car.transmission}</p>
                            <p className="text-[10px] text-slate-400">{car.mileage} KM</p>
                        </td>
                        <td className="p-4 border-y border-slate-100">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${car.inspection ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {car.inspection ? 'READY' : 'PENDING REPORT'}
                           </span>
                        </td>
                        <td className="p-4 rounded-r-xl border-y border-r border-slate-100 text-right">
                            <button className="bg-slate-900 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 transition-all shadow-sm">
                                Start Review
                            </button>
                                </td>
                                </tr>
                                ))}
                           </tbody>
                        </table>
                    </div>
                </div>
                )}
            </div>
        </main>
        </div>
    );
};

export default Profile;