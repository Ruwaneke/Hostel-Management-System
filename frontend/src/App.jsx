import React from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotificationProvider from "./context/NotificationContext";
import BookingProvider from "./context/BookingContext";
import LaundryPage from "./pages/LaundryPage";

function App() {
  return (
    <NotificationProvider>
      <BookingProvider>
        <Router>
          <div className="bg-gray-50 min-h-screen transition-colors">
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path="/laundry" element={<LaundryPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </Router>
      </BookingProvider>
    </NotificationProvider>
  );
}

export default App;