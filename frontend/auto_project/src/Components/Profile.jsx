import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Admin/Sidebar'; 

const Profile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [myCars, setMyCars] = useState([]); // Uses CarSerializer
    const [pendingApprovals, setPendingApprovals] = useState([]); // Cars where status='PENDING'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with your actual endpoint for the logged-in user
        axios.get('/api/auth/user/') 
            .then(res => {
                setUser(res.data);
                if (res.data.role === 'DEALERSHIP_ADMIN') fetchPendingForDealership(res.data.dealership);
                if (res.data.role === 'USER') fetchUserCars();
                setLoading(false);
            })
            .catch(err => {
                console.error("Auth error", err);
                setLoading(false);
            });
    }, []);

    const fetchUserCars = () => {
        axios.get('/api/cars/my-submissions/').then(res => setMyCars(res.data));
    };

    const fetchPendingForDealership = (dealershipId) => {
        // Fetches cars filtered by dealership and status='PENDING'
        axios.get(`/api/cars/?dealership=${dealershipId}&status=PENDING`).then(res => setPendingApprovals(res.data));
    };

    if (loading) return <div className="p-10 text-center font-mono">INITIALIZING AUTOHUB...</div>;

    return (
        <div className="flex min-h-screen bg-gray-50 text-slate-900">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-10">
                {/* Header Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {user.username[0].toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">{user.username}</h1>
                            <p className="text-slate-500 text-sm">{user.email} • {user.phone_number}</p>
                            <div className="flex gap-2 mt-3">
                                <span className="bg-slate-100 px-3 py-1 rounded text-xs font-bold border border-slate-200">
                                    {user.role}
                                </span>
                                {user.is_verified && (
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">VERIFIED</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Logic */}
                <div className="flex gap-8 border-b border-slate-200 mb-6">
                    <button onClick={() => setActiveTab('overview')} className={`pb-4 text-sm font-bold ${activeTab === 'overview' ? 'border-b-2 border-slate-900' : 'text-slate-400'}`}>OVERVIEW</button>
                    {user.role === 'USER' && (
                        <button onClick={() => setActiveTab('garage')} className={`pb-4 text-sm font-bold ${activeTab === 'garage' ? 'border-b-2 border-slate-900' : 'text-slate-400'}`}>MY SUBMISSIONS</button>
                    )}
                    {user.role === 'DEALERSHIP_ADMIN' && (
                        <button onClick={() => setActiveTab('approvals')} className={`pb-4 text-sm font-bold ${activeTab === 'approvals' ? 'border-b-2 border-slate-900' : 'text-slate-400'}`}>APPROVAL QUEUE</button>
                    )}
                </div>

                {/* Content Sections */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm min-h-[300px]">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Account Details</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-bold">Member Since:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                                    <p><span className="font-bold">Associated Dealership ID:</span> {user.dealership || 'None'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USER GARAGE TAB */}
                    {activeTab === 'garage' && (
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-6">Track Your Sales</h2>
                            <div className="space-y-4">
                                {myCars.map(car => (
                                    <div key={car.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                                        <div>
                                            <h4 className="font-bold text-slate-800">{car.brand} {car.model}</h4>
                                            <p className="text-xs text-slate-500 uppercase font-bold">{car.status}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-slate-900">${car.price}</p>
                                            <p className="text-[10px] text-slate-400">{new Date(car.created_at).toDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* DEALERSHIP ADMIN APPROVALS TAB */}
                    {activeTab === 'approvals' && (
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-6 text-slate-800">Vehicle Inspection & Approval</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                                            <th className="pb-3">Vehicle Info</th>
                                            <th className="pb-3">Technical Specs</th>
                                            <th className="pb-3">Inspection Status</th>
                                            <th className="pb-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pendingApprovals.map(car => (
                                            <tr key={car.id} className="text-sm">
                                                <td className="py-4">
                                                    <p className="font-bold">{car.brand} {car.model} ({car.year})</p>
                                                    <p className="text-xs text-slate-500">ID: {car.id}</p>
                                                </td>
                                                <td className="py-4">
                                                    <p>{car.fuel_type} • {car.transmission}</p>
                                                    <p className="text-xs text-slate-400">{car.mileage} Mileage</p>
                                                </td>
                                                <td className="py-4">
                                                    {car.inspection ? (
                                                        <span className="text-green-600 font-bold text-xs uppercase">Report Ready</span>
                                                    ) : (
                                                        <span className="text-amber-500 font-bold text-xs uppercase">Pending Report</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button className="bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-600 transition">
                                                        REVIEW
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