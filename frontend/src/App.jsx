import React from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotificationProvider from "./context/NotificationContext";
import BookingProvider from "./context/BookingContext";

function App() {
  return (
    <NotificationProvider>
      <BookingProvider>
        <Router>
          <div className="bg-gray-50 min-h-screen dark:bg-gray-900 transition-colors">
            <Header />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path="/new" element={<Home />} />
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