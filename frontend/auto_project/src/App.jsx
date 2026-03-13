import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Mainlayout from "../assets/Components/Mainlayout";
import Home from "./assets/Components/Home";
import Cars from "./assets/Components/Cars";
import Rent from "./assets/Components/Rent";
import Sell from "./assets/Components/Sell";
import About from "./assets/Components/About";
import Login from "./assets/Components/Login";
import Register from "./assets/Components/Register";
import Dashboard from "./assets/Components/Dashboard";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App;
