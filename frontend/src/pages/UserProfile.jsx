import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Hostel Management System
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                  {user?.name}
                </h2>
                <p className="text-gray-600 text-center mt-2">{user?.email}</p>
                <div className="mt-4 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                  {user?.role}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Account Information</h3>
                  <dl className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">User ID:</dt>
                      <dd className="text-gray-900 font-medium">{user?._id?.substring(0, 8)}...</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Member Since:</dt>
                      <dd className="text-gray-900 font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {user?.name}! 👋
              </h2>
              <p className="text-gray-600 mb-4">
                You are logged in as a <span className="font-semibold capitalize">{user?.role}</span>.
              </p>
              <p className="text-gray-600">
                This is your personal dashboard where you can manage your hostel information and settings.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Room Information</h3>
                <p className="text-gray-600 text-sm">View and manage your room details and allocation.</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200">
                <div className="text-4xl mb-3">💳</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Payments</h3>
                <p className="text-gray-600 text-sm">Check and manage your payment history.</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Complaints</h3>
                <p className="text-gray-600 text-sm">File and track complaints or maintenance requests.</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200">
                <div className="text-4xl mb-3">⚙️</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-600 text-sm">Update your profile and account preferences.</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border border-blue-200">
                <h4 className="text-gray-600 text-sm font-semibold mb-2">Room Status</h4>
                <p className="text-2xl font-bold text-blue-600">Active</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 border border-green-200">
                <h4 className="text-gray-600 text-sm font-semibold mb-2">Payment Status</h4>
                <p className="text-2xl font-bold text-green-600">Paid</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-6 border border-yellow-200">
                <h4 className="text-gray-600 text-sm font-semibold mb-2">Pending Issues</h4>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
