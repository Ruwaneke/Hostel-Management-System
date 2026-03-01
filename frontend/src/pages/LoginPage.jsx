import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const { setTokenManually, token, user } = useAuth();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        roomNumber: '',
        hostelBlock: '',
    });

    // Already logged in — redirect to dashboard
    if (token && user) {
        if (user.role === 'student') return <Navigate to="/my-complaints" replace />;
        if (user.role === 'staff') return <Navigate to="/staff/complaints" replace />;
        if (user.role === 'admin') return <Navigate to="/admin/complaints" replace />;
    }

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = isRegister
                ? await registerUser(form)
                : await loginUser({ email: form.email, password: form.password });

            setTokenManually(data.token, data.user);
            toast.success(data.message);

            if (data.user.role === 'student') navigate('/my-complaints');
            else if (data.user.role === 'staff') navigate('/staff/complaints');
            else navigate('/admin/complaints');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-blue-700 mb-1">
                    🏠 Hostel Management System
                </h1>
                <p className="text-center text-xs text-amber-600 bg-amber-50 rounded p-2 mb-6">
                    ⚠️ Testing Mode — Will integrate with User Management System later.
                </p>

                {/* Tab Toggle */}
                <div className="flex rounded-lg border border-gray-200 mb-6 overflow-hidden">
                    <button type="button" onClick={() => setIsRegister(false)}
                        className={`flex-1 py-2 text-sm font-medium transition ${!isRegister ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        Login
                    </button>
                    <button type="button" onClick={() => setIsRegister(true)}
                        className={`flex-1 py-2 text-sm font-medium transition ${isRegister ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input name="name" value={form.name} onChange={handleChange} required={isRegister}
                                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. John Silva" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required
                            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. john@hostel.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input name="password" type="password" value={form.password} onChange={handleChange} required
                            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Min 6 characters" minLength={6} />
                    </div>

                    {isRegister && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select name="role" value={form.role} onChange={handleChange}
                                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="student">Student</option>
                                    <option value="staff">Maintenance Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {form.role === 'student' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Room No.</label>
                                        <input name="roomNumber" value={form.roomNumber} onChange={handleChange} required
                                            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g. 204" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Block</label>
                                        <input name="hostelBlock" value={form.hostelBlock} onChange={handleChange} required
                                            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g. Block A" />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
                        {loading
                            ? (isRegister ? 'Registering...' : 'Logging in...')
                            : (isRegister ? 'Register & Login' : 'Login')}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => setIsRegister(!isRegister)} className="text-blue-600 hover:underline ml-1">
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;