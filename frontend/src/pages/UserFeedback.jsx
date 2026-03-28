import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function UserFeedback({ isEmbedded = false }) {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: 'General',
    title: '',
    description: '',
    rating: 5
  });

  const categories = ['General', 'Food & Mess', 'Room Facilities', 'Cleanliness', 'Security', 'Other'];

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await feedbackAPI.getMyFeedback();
      if (response.success) {
        setFeedbacks(response.data || []);
      } else {
        toast.error('Load Failed', response.message || 'Failed to fetch feedback history');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error fetching feedback history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.warning('Missing Fields', 'Please fill out the title and description.');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await feedbackAPI.submitFeedback(formData);
      if (response.success) {
        toast.success('Feedback Sent!', 'Thank you for helping us improve.');
        setShowForm(false);
        setFormData({ category: 'General', title: '', description: '', rating: 5 });
        fetchFeedbacks();
      } else {
        toast.error('Submission Failed', response.message || 'Failed to submit feedback');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="relative max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight mb-2">
            System <span className="text-brand-gold drop-shadow-sm">Feedback</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Help us improve the hostel experience</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-gold hover:bg-[#e5920f] text-brand-black font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-lg">{showForm ? '❌' : '➕'}</span>
          <span>{showForm ? 'Cancel' : 'New Feedback'}</span>
        </button>
      </div>

      {/* Submission Form */}
      {showForm && (
        <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-8 mb-8 shadow-xl shadow-brand-platinum/20 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-2xl font-black text-brand-navy mb-6">Submit Your Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-brand-navy font-bold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-platinum/10 border border-brand-platinum/30 rounded-xl focus:ring-2 focus:ring-brand-gold focus:outline-none transition-colors text-brand-black"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-brand-navy font-bold mb-2">Rating</label>
                <div className="flex gap-2 items-center h-12">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${star <= formData.rating ? 'text-brand-gold' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-bold text-slate-500">
                    {formData.rating}/5 Stars
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-brand-navy font-bold mb-2">Subject / Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Brief summary of your feedback..."
                className="w-full px-4 py-3 bg-brand-platinum/10 border border-brand-platinum/30 rounded-xl focus:ring-2 focus:ring-brand-gold focus:outline-none transition-colors text-brand-black"
              />
            </div>

            <div>
              <label className="block text-brand-navy font-bold mb-2">Detailed Description</label>
              <textarea
                required
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Please describe your experience, suggestions, or issues in detail..."
                className="w-full px-4 py-3 bg-brand-platinum/10 border border-brand-platinum/30 rounded-xl focus:ring-2 focus:ring-brand-gold focus:outline-none transition-colors text-brand-black resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-brand-platinum/30">
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-navy hover:bg-brand-black text-brand-gold font-black py-4 px-10 rounded-xl transition shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center gap-3"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback 🚀'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback History List */}
      <h3 className="text-xl font-black text-slate-700 mb-4 px-2 tracking-tight">Your Feedback History</h3>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-brand-platinum/40 border-t-brand-navy rounded-full animate-spin"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-12 text-center shadow-lg shadow-brand-platinum/10">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-brand-navy text-xl font-black mb-2 tracking-tight">No feedback submitted yet</h3>
          <p className="text-slate-500 font-medium">Your thoughts help us improve. Submit your first feedback above!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {feedbacks.map(fb => (
            <div key={fb._id} className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-6 hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      fb.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      fb.status === 'Reviewed' ? 'bg-sky-100 text-sky-700 border border-sky-200' :
                      'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {fb.status}
                    </span>
                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      {fb.category}
                    </span>
                    <span className="text-slate-400 text-sm font-semibold">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-black text-brand-navy mb-2">{fb.title}</h4>
                  <p className="text-slate-600 font-medium leading-relaxed bg-brand-platinum/10 p-4 rounded-xl border border-brand-white mt-3">
                    {fb.description}
                  </p>

                  {/* Rating Stars Representation */}
                  <div className="flex items-center gap-1 mt-4">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-lg ${s <= fb.rating ? 'text-brand-gold' : 'text-slate-200'}`}>★</span>
                    ))}
                  </div>
                </div>

                {fb.adminResponse && (
                  <div className="md:w-1/3 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 relative">
                    <div className="absolute top-0 right-0 p-3 opacity-20 text-4xl">👨‍💼</div>
                    <p className="text-xs font-black text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>✓</span> Admin Response
                    </p>
                    <p className="text-blue-900 text-sm font-medium leading-relaxed relative z-10">
                      {fb.adminResponse}
                    </p>
                  </div>
                )}
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return <>{content}</>;
  }

  return (
    <div className="min-h-screen bg-brand-platinum/20 relative py-12 px-4 selection:bg-brand-gold/30 selection:text-brand-navy text-brand-black">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-platinum/50 to-transparent pointer-events-none" />
      <div className="absolute top-20 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      {content}
    </div>
  );
}
