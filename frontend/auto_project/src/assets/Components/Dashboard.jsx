import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);
    fetchData(currentUser);
  }, []);

  const fetchData = async (currentUser) => {
    try {
      if (currentUser.role === 'SUPER_ADMIN') {
        const companiesRes = await axios.get('/api/companies/');
        setCompanies(companiesRes.data);
      } else if (currentUser.role === 'DEALERSHIP_ADMIN') {
        const [carsRes, rentalsRes, purchasesRes] = await Promise.all([
          axios.get(`/api/cars/?dealership=${currentUser.dealership}`),
          axios.get('/api/rentals/'),
          axios.get('/api/purchases/')
        ]);
        setCars(carsRes.data);
        setRentals(rentalsRes.data);
        setPurchases(purchasesRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveCompany = async (companyId) => {
    try {
      await axios.post(`/api/companies/${companyId}/approve/`);
      fetchData(user);
    } catch (error) {
      console.error('Error approving company:', error);
    }
  };

  const approveCar = async (carId) => {
    try {
      await axios.post(`/api/cars/${carId}/approve/`);
      fetchData(user);
    } catch (error) {
      console.error('Error approving car:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div className="dashboard p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {user.role === 'SUPER_ADMIN' && (
        <div className="super-admin-section">
          <h2 className="text-2xl font-semibold mb-4">Company Approvals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.filter(c => c.status === 'PENDING').map(company => (
              <div key={company.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-medium">{company.company_name}</h3>
                <p>Email: {company.company_email}</p>
                <p>License: {company.company_license_number}</p>
                <button
                  onClick={() => approveCompany(company.id)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8">Approved Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.filter(c => c.status === 'APPROVED').map(company => (
              <div key={company.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-medium">{company.name}</h3>
                <p>Email: {company.email}</p>
                <p>City: {company.city}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.role === 'DEALERSHIP_ADMIN' && (
        <div className="dealership-admin-section">
          <h2 className="text-2xl font-semibold mb-4">Car Approvals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.filter(c => c.status === 'PENDING').map(car => (
              <div key={car.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-medium">{car.title}</h3>
                <p>Brand: {car.brand} {car.model}</p>
                <p>Year: {car.year}</p>
                <p>Mileage: {car.mileage}</p>
                <button
                  onClick={() => approveCar(car.id)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8">Your Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map(car => (
              <div key={car.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-medium">{car.title}</h3>
                <p>Status: {car.status}</p>
                <p>Price: ${car.price}</p>
                {car.is_for_rent && <p>Rental: ${car.rental_price_per_day}/day</p>}
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8">Recent Rentals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Car</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Dates</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.slice(0, 10).map(rental => (
                  <tr key={rental.id}>
                    <td className="px-4 py-2">{rental.car.title}</td>
                    <td className="px-4 py-2">{rental.user.username}</td>
                    <td className="px-4 py-2">{rental.start_date} - {rental.end_date}</td>
                    <td className="px-4 py-2">{rental.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Car</th>
                  <th className="px-4 py-2">Buyer</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.slice(0, 10).map(purchase => (
                  <tr key={purchase.id}>
                    <td className="px-4 py-2">{purchase.car.title}</td>
                    <td className="px-4 py-2">{purchase.buyer.username}</td>
                    <td className="px-4 py-2">${purchase.price_at_purchase}</td>
                    <td className="px-4 py-2">{purchase.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {user.role === 'USER' && (
        <div className="user-section">
          <h2 className="text-2xl font-semibold mb-4">My Cars</h2>
          {/* User specific content */}
          <p>User dashboard content here</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;