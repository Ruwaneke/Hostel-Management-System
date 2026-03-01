import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const links = {
        student: [
            { label: 'My Complaints', path: '/my-complaints' },
            { label: '+ Submit', path: '/submit-complaint' },
        ],
        admin: [
            { label: 'Dashboard', path: '/admin/complaints' },
            { label: 'Reports', path: '/admin/reports' },
        ],
        staff: [
            { label: 'My Tasks', path: '/staff/complaints' },
        ],
    };

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <span className="font-bold text-blue-700 text-lg cursor-pointer" onClick={() => navigate('/')}>
                        🏠 HMS
                    </span>
                    <div className="flex gap-4">
                        {user && links[user.role]?.map((l) => (
                            <button key={l.path} onClick={() => navigate(l.path)}
                                className="text-sm text-gray-600 hover:text-blue-600 transition">{l.label}</button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <span className="text-sm text-gray-500">{user.name} <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">{user.role}</span></span>
                            <button onClick={() => { logout(); navigate('/login'); }}
                                className="text-sm text-red-500 hover:text-red-700">Logout</button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/login')}
                            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Login</button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;