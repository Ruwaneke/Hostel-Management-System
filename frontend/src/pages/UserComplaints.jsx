import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';

export default function UserComplaints() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await complaintAPI.getComplaints();
      if (response.success) {
        setComplaints(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch complaints');
      }
    } catch (err) {
      setError(err.message || 'Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  const getStatusConfig = (status) => {
    const configs = {
      open: { icon: '🔴', color: 'from-yellow-400 to-orange-500', label: 'Open' },
      'in-progress': { icon: '🟡', color: 'from-blue-400 to-cyan-500', label: 'In Progress' },
      resolved: { icon: '🟢', color: 'from-green-400 to-emerald-500', label: 'Resolved' }
    };
    return configs[status] || configs.open;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      low: { icon: '⬇️', color: 'bg-blue-500/20 border-blue-500/50 text-blue-200' },
      medium: { icon: '➡️', color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200' },
      high: { icon: '⬆️', color: 'bg-red-500/20 border-red-500/50 text-red-200' }
    };
    return configs[priority] || configs.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      maintenance: '🔧',
      noise: '🔊',
      cleanliness: '🧹',
      food: '🍽️',
      other: '❓'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden py-12 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
              My <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Complaints</span>
            </h1>
            <p className="text-indigo-200">Track and manage your hostel complaints</p>
          </div>
          <button
            onClick={() => navigate('/create-complaint')}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <span>➕</span>
            <span>New Complaint</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scroll-smooth">
          {['all', 'open', 'in-progress', 'resolved'].map(status => {
            const config = getStatusConfig(status);
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 backdrop-blur border ${
                  filter === status
                    ? `bg-gradient-to-r ${config.color} border-white/50 text-white shadow-lg`
                    : 'bg-white/10 border-white/30 text-white/70 hover:bg-white/20 hover:border-white/50'
                }`}
              >
                <span className="mr-2">{config.icon}</span>
                {status === 'all' ? 'All' : config.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-2xl mb-6 backdrop-blur flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-indigo-200">Loading your complaints...</p>
            </div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-12 text-center">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-white text-xl font-bold mb-2">No complaints found</p>
            <p className="text-indigo-200 mb-6">
              {filter === 'all' 
                ? "You haven't filed any complaints yet. Click the button above to get started!" 
                : `No ${filter} complaints at the moment.`}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="text-indigo-300 hover:text-indigo-100 font-semibold"
              >
                View all complaints →
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredComplaints.map(complaint => {
              const statusConfig = getStatusConfig(complaint.status);
              const priorityConfig = getPriorityConfig(complaint.priority);
              return (
                <div
                  key={complaint._id}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group overflow-hidden relative"
                >
                  {/* Gradient border effect */}
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${statusConfig.color}`} />

                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative">
                    {/* Left Content */}
                    <div className="flex-1">
                      {/* Title with category icon */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{getCategoryIcon(complaint.category)}</span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-yellow-300 transition">
                          {complaint.title}
                        </h3>
                      </div>

                      {/* Meta info */}
                      <p className="text-sm text-indigo-300 mb-3">
                        <span className="font-semibold">ID:</span> {complaint.complaintId} • Posted {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>

                      {/* Description */}
                      <p className="text-white/70 mb-4 line-clamp-2">{complaint.description}</p>

                      {/* Admin Response */}
                      {complaint.adminResponse && (
                        <div className="bg-indigo-500/30 border border-indigo-400/50 rounded-xl p-4 mb-4 backdrop-blur">
                          <p className="text-sm font-bold text-indigo-200 mb-1">👨‍💼 Admin Response:</p>
                          <p className="text-indigo-100 text-sm">{complaint.adminResponse}</p>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur border border-white/30 ${
                          `bg-gradient-to-r ${statusConfig.color} border-white/50`
                        }`}>
                          <span>{statusConfig.icon}</span>
                          <span className="text-white font-semibold text-sm">{statusConfig.label}</span>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur border ${priorityConfig.color}`}>
                          <span>{getPriorityConfig(complaint.priority).icon}</span>
                          <span className="font-semibold text-sm capitalize">{complaint.priority} Priority</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Resolved Date */}
                    {complaint.resolvedAt && (
                      <div className="text-right bg-green-500/20 border border-green-500/50 rounded-xl p-4 backdrop-blur">
                        <p className="text-green-200 text-xs font-semibold mb-1">✅ RESOLVED</p>
                        <p className="text-green-300 font-bold text-sm">
                          {new Date(complaint.resolvedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}