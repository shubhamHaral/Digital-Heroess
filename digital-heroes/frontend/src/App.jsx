import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";   // ✅ ADD THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 🔥 ADMIN ROUTE ADDED */}
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;