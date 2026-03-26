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
import AdminRestaurants from './pages/AdminRestaurants';
import AdminRestaurantDetails from './pages/AdminRestaurantDetails';
import AdminMenus from './pages/AdminMenus';
import UserMenusView from './pages/UserMenusView';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Student/User Protected Routes */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute requiredRole={['user', 'student']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-complaint"
            element={
              <ProtectedRoute requiredRole={['user', 'student']}>
                <CreateComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-complaints"
            element={
              <ProtectedRoute requiredRole={['user', 'student']}>
                <UserComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/menus"
            element={
              <ProtectedRoute requiredRole={['user', 'student']}>
                <UserMenusView />
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
          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminRestaurants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurants/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminRestaurantDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/menus"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminMenus />
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
