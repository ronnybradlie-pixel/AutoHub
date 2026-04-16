import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Mainlayout from "./Components/Mainlayout";
import Home from "./Components/Home";
import Cars from "./Components/Cars";
import About from "./Components/About";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import AuthContext, { AuthProvider } from "./Components/AuthContext";
import Footer from "./Components/Footer";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
          <Route index element={<Home />} />
          <Route path="cars" element={<Cars />} />
          <Route path="about" element={<About />} />
          <Route path="AuthContext" element={<AuthContext />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Dashboard />} /> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="footer" element={<Footer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
