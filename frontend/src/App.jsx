import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth & Toast
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";  
import { ProtectedRoute } from "./components/ProtectedRoute";

// Providers
import NotificationProvider from "./context/NotificationContext";
import BookingProvider from "./context/BookingContext";

// Pages - Public
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Unauthorized from "./pages/Unauthorized";

// Pages - Features

import Dashboard from "./pages/Dashboard";

// Pages - User Protected
import UserDashboard from "./pages/UserDashboard";
import CreateComplaint from "./pages/CreateComplaint";
import UserComplaints from "./pages/UserComplaints";
import LaundryPage from "./pages/LaundryPage";
import PaymentForm from "./components/PaymentForm";


// Pages - Admin Protected
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";

import "./index.css";


function App() {
  return (
    <NotificationProvider>
      <BookingProvider>
        <Router>
          <AuthProvider>
            <ToastProvider>
              <div className="bg-gray-50 min-h-screen transition-colors">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />

                  {/* Feature Routes */}
                   <Route path="/laundry" element={<LaundryPage />} />
                   <Route path="/payment" element={<PaymentForm />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* User Protected Routes */}
                  <Route
                    path="/user-dashboard"
                    element={
                      <ProtectedRoute requiredRole="user">
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-complaint"
                    element={
                      <ProtectedRoute requiredRole="user">
                        <CreateComplaint />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user-complaints"
                    element={
                      <ProtectedRoute requiredRole="user">
                        <UserComplaints />
                      </ProtectedRoute>
                    }
                  />
                    

                  {/* Admin Protected Routes */}
                  <Route path="/admin" element={<Admin />} />
                  <Route
                    path="/admin-dashboard"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-complaints"
                    element={
                      <ProtectedRoute requiredRole={["admin", "staff"]}>
                        <AdminComplaints />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </ToastProvider>
          </AuthProvider>
        </Router>
      </BookingProvider>
    </NotificationProvider>
  );
}

export default App;