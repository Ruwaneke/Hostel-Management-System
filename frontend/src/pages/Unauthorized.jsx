import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page. Your role is: <span className="font-semibold capitalize">{user?.role}</span>
        </p>

        <button
          onClick={() => {
            if (user?.role === 'admin') {
              navigate('/admin-dashboard');
            } else {
              navigate('/user-profile');
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
