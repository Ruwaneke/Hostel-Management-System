import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ReportsPage from './pages/ReportsPage';

// Smart home redirect based on role
const HomeRedirect = () => {
    const { token, user } = useAuth();
    if (!token || !user) return <Navigate to="/login" replace />;
    if (user.role === 'student') return <Navigate to="/my-complaints" replace />;
    if (user.role === 'staff') return <Navigate to="/staff/complaints" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/complaints" replace />;
    return <Navigate to="/login" replace />;
};

function App() {
    return (
        <AuthProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: { fontSize: '14px' },
                }}
            />
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                <Routes>
                    {/* Home — smart redirect */}
                    <Route path="/" element={<HomeRedirect />} />

                    {/* Auth */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Student */}
                    <Route path="/my-complaints" element={
                        <ProtectedRoute roles={['student']}>
                            <MyComplaintsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/submit-complaint" element={
                        <ProtectedRoute roles={['student']}>
                            <SubmitComplaintPage />
                        </ProtectedRoute>
                    } />

                    {/* Shared */}
                    <Route path="/complaint/:complaintId" element={
                        <ProtectedRoute roles={['student', 'staff', 'admin']}>
                            <ComplaintDetailPage />
                        </ProtectedRoute>
                    } />

                    {/* Admin */}
                    <Route path="/admin/complaints" element={
                        <ProtectedRoute roles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/reports" element={
                        <ProtectedRoute roles={['admin']}>
                            <ReportsPage />
                        </ProtectedRoute>
                    } />

                    {/* Staff */}
                    <Route path="/staff/complaints" element={
                        <ProtectedRoute roles={['staff']}>
                            <StaffDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </AuthProvider>
    );
}

export default App;
