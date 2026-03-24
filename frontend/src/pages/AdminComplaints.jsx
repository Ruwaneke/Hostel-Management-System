import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';

export default function AdminComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('open');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', adminResponse: '' });
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (filter === 'all') {
        response = await complaintAPI.getComplaints();
      } else {
        response = await complaintAPI.getComplaintsByStatus(filter);
      }

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

  const handleSelectComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateForm({
      status: complaint.status,
      adminResponse: complaint.adminResponse || ''
    });
    setSuccessMsg('');
  };

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;

    setUpdating(true);
    setError('');
    try {
      const response = await complaintAPI.updateComplaint(selectedComplaint._id, {
        status: updateForm.status,
        adminResponse: updateForm.adminResponse
      });

      if (response.success) {
        setComplaints(complaints.map(c =>
          c._id === selectedComplaint._id ? response.data : c
        ));
        setSelectedComplaint(null);
        setSuccessMsg('Complaint updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(response.message || 'Failed to update complaint');
      }
    } catch (err) {
      setError(err.message || 'Error updating complaint');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) return;

    try {
      const response = await complaintAPI.deleteComplaint(complaintId);
      if (response.success) {
        setComplaints(complaints.filter(c => c._id !== complaintId));
        setSelectedComplaint(null);
        setSuccessMsg('Complaint deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(response.message || 'Failed to delete complaint');
      }
    } catch (err) {
      setError(err.message || 'Error deleting complaint');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'from-yellow-400 to-orange-500',
      'in-progress': 'from-blue-400 to-cyan-500',
      resolved: 'from-green-400 to-emerald-500'
    };
    return colors[status] || 'from-gray-400 to-gray-500';
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

  const filteredComplaints = complaints.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCounts = {
    all: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    'in-progress': complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden py-12 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
            Manage <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Complaints</span>
          </h1>
          <p className="text-indigo-200">Review and respond to hostel complaints</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['all', 'open', 'in-progress', 'resolved'].map(stat => {
            const colors = {
              all: 'from-gray-400 to-gray-600',
              open: 'from-yellow-400 to-orange-500',
              'in-progress': 'from-blue-400 to-cyan-500',
              resolved: 'from-green-400 to-emerald-500'
            };
            return (
              <div key={stat} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition">
                <p className="text-indigo-200 text-xs font-semibold uppercase mb-2 capitalize">{stat}</p>
                <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${colors[stat]} bg-clip-text text-transparent`}>
                  {statCounts[stat]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, ID, or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 focus:bg-white/20 transition backdrop-blur"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-2xl mb-6 backdrop-blur flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-2xl mb-6 backdrop-blur flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Complaints List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-indigo-200">Loading complaints...</p>
                </div>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 text-center">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-white font-bold">No complaints found</p>
                <p className="text-indigo-200 text-sm mt-2">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredComplaints.map(complaint => (
                  <div
                    key={complaint._id}
                    onClick={() => handleSelectComplaint(complaint)}
                    className={`bg-white/10 backdrop-blur border rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedComplaint?._id === complaint._id
                        ? 'border-indigo-4border-indigo-400 bg-indigo-500/20 shadow-lg'
                        : 'border-white/20 hover:border-white/30 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getCategoryIcon(complaint.category)}</span>
                          <h3 className="font-bold text-white text-lg line-clamp-1">{complaint.title}</h3>
                        </div>
                        <p className="text-sm text-indigo-300 mb-2">
                          <span className="font-semibold">{complaint.complaintId}</span> • {complaint.student.name}
                        </p>
                        <p className="text-sm text-white/60 line-clamp-1">{complaint.description}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getStatusColor(complaint.status)} text-white text-xs font-bold whitespace-nowrap`}>
                        {complaint.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedComplaint ? (
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 sticky top-24">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Details
                </h3>

                {/* Student Info */}
                <div className="mb-6 pb-6 border-b border-white/20">
                  <p className="text-xs text-indigo-300 font-semibold mb-1">FROM</p>
                  <p className="font-bold text-white text-lg mb-1">{selectedComplaint.student.name}</p>
                  <p className="text-sm text-indigo-200 mb-2">{selectedComplaint.student.email}</p>
                  <p className="text-sm text-indigo-200">
                    📍 {selectedComplaint.student.roomNumber || 'N/A'} • {selectedComplaint.student.hostelBlock || 'N/A'}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6 pb-6 border-b border-white/20">
                  <p className="text-xs text-indigo-300 font-semibold mb-2">DESCRIPTION</p>
                  <p className="text-white text-sm leading-relaxed">{selectedComplaint.description}</p>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="block text-xs text-indigo-300 font-semibold mb-2">UPDATE STATUS</label>
                  <select
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-indigo-400 transition"
                  >
                    <option value="open">🔴 Open</option>
                    <option value="in-progress">🟡 In Progress</option>
                    <option value="resolved">🟢 Resolved</option>
                  </select>
                </div>

                {/* Response */}
                <div className="mb-6">
                  <label className="block text-xs text-indigo-300 font-semibold mb-2">ADMIN RESPONSE</label>
                  <textarea
                    value={updateForm.adminResponse}
                    onChange={(e) => setUpdateForm({ ...updateForm, adminResponse: e.target.value })}
                    placeholder="Write your response..."
                    rows="3"
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 resize-none transition"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateComplaint}
                    disabled={updating}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 disabled:from-indigo-300 disabled:to-blue-300 text-white font-bold py-2 rounded-xl transition"
                  >
                    {updating ? '⏳ Updating...' : '✅ Update'}
                  </button>
                  <button
                    onClick={() => handleDeleteComplaint(selectedComplaint._id)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-200 font-bold py-2 rounded-xl transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center sticky top-24">
                <p className="text-3xl mb-3">👆</p>
                <p className="text-white font-bold">Select a complaint to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}