import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { token, user } = useAuth();
    const location = useLocation();

    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Redirect to their correct dashboard instead of blank
        if (user.role === 'student') return <Navigate to="/my-complaints" replace />;
        if (user.role === 'staff') return <Navigate to="/staff/complaints" replace />;
        if (user.role === 'admin') return <Navigate to="/admin/complaints" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;