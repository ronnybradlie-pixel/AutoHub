import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: add authentication logic and store user in localStorage
    const fakeUser = {
      id: 1,
      username: "dealer_admin",
      role: "DEALERSHIP_ADMIN",
    };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border-gray-300 p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border-gray-300 p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;