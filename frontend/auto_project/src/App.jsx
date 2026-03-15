import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mainlayout from "./assets/Components/Mainlayout";
import Home from "./assets/Components/Home";
import Cars from "./assets/Components/Cars";
import About from "./assets/Components/About";
import Login from "./assets/Components/Login";
import Register from "./assets/Components/Register";
import Dashboard from "./assets/Components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
          <Route index element={<Home />} />
          <Route path="cars" element={<Cars />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
