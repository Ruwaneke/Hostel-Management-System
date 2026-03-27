import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AIChatbot from './components/AIChatbot';

function SmartChatbot() {
  const location = useLocation();
  const hideOnPages = ['/login', '/register', '/admin-dashboard', '/unauthorized', '/admin-complaints'];

  if (hideOnPages.includes(location.pathname)) return null;

  return <AIChatbot />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>

          <SmartChatbot />

          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />

            {/* USER ROUTES (FIXED ROLE) */}
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

            {/* ADMIN ROUTES */}
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

        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;