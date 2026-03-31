import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import api from "../api/axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await api.post("/auto/users/register/", {
        username,
        email,
        password,
        phone_number: phoneNumber,
      });

      // Redirect to login on success
      navigate("/login");
    } catch (err) {
      // Logic to handle Django Rest Framework error objects
      const errorData = err.response?.data;
      setError(errorData || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <h1 className="text-white font-bold text-center">Create an Account</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-md border border-gray-100">
        {error && (
          <div className="rounded border border-red-300 bg-red-50 p-3 text-red-800 text-sm">
            {typeof error === 'string' ? error : Object.values(error).flat().join(", ")}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="e.g. +123456789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-purple-600 px-4 py-2 text-white font-semibold hover:bg-purple-700 transition-colors"
        >
          Register
        </button>

        {/* This is the part you requested */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;