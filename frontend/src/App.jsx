import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Unauthorized from './pages/Unauthorized';
import CreateComplaint from './pages/CreateComplaint';
import UserComplaints from './pages/UserComplaints';
import AdminComplaints from './pages/AdminComplaints';
import './index.css';

// Booking Pages
import UserBookingCheckout from './pages/RoomAllocation/UserBookingCheckout';
import PaymentSuccess from './pages/RoomAllocation/PaymentSuccess'; 

// Laundry Pages
import LaundrySuccess from './pages/Londary/LaundrySuccess';

// --- NEW CHATBOT IMPORT ---
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          {/* Routes define which component to show based on the URL.
              The Chatbot is placed outside Routes so it persists everywhere.
          */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Student Protected Routes */}
            <Route
              path="/book/:roomId"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserBookingCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-success/:bookingId"
              element={
                <ProtectedRoute requiredRole="user">
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/laundry-success"
              element={
                <ProtectedRoute requiredRole="user">
                  <LaundrySuccess />
                </ProtectedRoute>
              }
            />
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
                <ProtectedRoute requiredRole={['admin', 'staff']}>
                  <AdminComplaints />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* --- SMART HOSTEL ASSISTANT WIDGET --- */}
          <Chatbot />

        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;