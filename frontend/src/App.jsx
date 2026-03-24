import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// 2. CREATE A SMART WRAPPER FOR THE CHATBOT
// This function checks the current page URL and hides the chatbot on specific pages
function SmartChatbot() {
  const location = useLocation();
  
  // List the exact paths where the chatbot SHOULD NOT appear
  const hideOnPages = ['/login', '/register', '/admin-dashboard', '/unauthorized'];
  
  if (hideOnPages.includes(location.pathname)) {
    return null; // Hide chatbot
  }
  
  return <AIChatbot />; // Show chatbot on Home, UserDashboard, FAQ, Contact, etc.
}

function App() {
  return (
    <Router>
      <AuthProvider>
        
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

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* 3. PLACE THE CHATBOT HERE */}
        {/* Because it is inside the Router but outside the Routes, it floats globally! */}
        <SmartChatbot />

      </AuthProvider>
    </Router>
  );
}

export default App;