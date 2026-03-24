import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';

export default function CreateComplaint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    priority: 'medium'
  });

  const categories = [
    { value: 'maintenance', icon: '🔧', label: 'Maintenance' },
    { value: 'noise', icon: '🔊', label: 'Noise Issue' },
    { value: 'cleanliness', icon: '🧹', label: 'Cleanliness' },
    { value: 'food', icon: '🍽️', label: 'Food Quality' },
    { value: 'other', icon: '❓', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'from-blue-400 to-cyan-400' },
    { value: 'medium', label: 'Medium', color: 'from-yellow-400 to-orange-400' },
    { value: 'high', label: 'High', color: 'from-red-400 to-pink-400' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required');
        setLoading(false);
        return;
      }

      if (formData.title.length > 100) {
        setError('Title cannot exceed 100 characters');
        setLoading(false);
        return;
      }

      const response = await complaintAPI.createComplaint(formData);

      if (response.success) {
        setTimeout(() => {
          navigate('/user-complaints');
        }, 800);
      } else {
        setError(response.message || 'Failed to create complaint');
      }
    } catch (err) {
      setError(err.message || 'Error creating complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden py-12 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            File a <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Complaint</span>
          </h1>
          <p className="text-indigo-200 text-lg">Help us improve by reporting any issues in your hostel</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/20 shadow-2xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3 backdrop-blur">
              <span className="text-2xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-white font-bold text-lg mb-3">
                🏷️ Complaint Title
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., Broken bathroom tap, Noisy neighbors"
                maxLength="100"
                required
                className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 focus:bg-white/20 transition backdrop-blur"
              />
              <p className="text-indigo-200 text-xs mt-2">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-bold text-lg mb-3">
                📂 Category
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-3 rounded-2xl transition-all duration-300 backdrop-blur border text-sm font-semibold flex flex-col items-center gap-2 ${
                      formData.category === cat.value
                        ? 'bg-indigo-500/40 border-indigo-400 text-white shadow-lg shadow-indigo-500/50'
                        : 'bg-white/10 border-white/30 text-white/70 hover:bg-white/20 hover:border-white/50'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="hidden sm:block">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-bold text-lg mb-3">
                📝 Description
                <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your complaint in detail... (What happened, where, when, etc.)"
                rows="5"
                required
                className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 focus:bg-white/20 transition resize-none backdrop-blur"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-white font-bold text-lg mb-4">
                ⚡ Priority Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p.value })}
                    className={`p-4 rounded-2xl transition-all duration-300 font-bold backdrop-blur border-2 ${
                      formData.priority === p.value
                        ? `bg-gradient-to-r ${p.color} border-white text-white shadow-lg`
                        : 'bg-white/10 border-white/30 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 disabled:from-indigo-300 disabled:to-blue-300 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition border border-white/30 hover:border-white/50"
              >
                ← Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-indigo-500/20 backdrop-blur border border-indigo-400/50 rounded-2xl p-6">
          <p className="text-indigo-100 text-sm flex items-start gap-3">
            <span className="text-xl mt-1">ℹ️</span>
            <span>Your complaint will be reviewed by the hostel admin team. You'll receive updates on the status of your complaint via email.</span>
          </p>
        </div>
      </div>
    </div>
  );
}