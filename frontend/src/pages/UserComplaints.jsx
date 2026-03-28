import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function UserComplaints({ isEmbedded = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { toast } = useToast();
  
  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await complaintAPI.getMyComplaints();
      if (response.success) {
        setComplaints(response.data || []);
      } else {
        toast.error('Failed to Load', response.message || 'Failed to fetch complaints');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = filter === 'All' 
    ? complaints 
    : complaints.filter(c => {
        if (filter === 'Active') return ['Pending', 'Assigned', 'In Progress'].includes(c.status);
        if (filter === 'Resolved') return ['Completed', 'Closed'].includes(c.status);
        return c.status === filter;
      });

  const getStatusConfig = (status) => {
    const configs = {
      'Pending': { icon: '⏳', color: 'bg-slate-100 text-slate-700 border-slate-200' },
      'Assigned': { icon: '👨‍🔧', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      'In Progress': { icon: '🚧', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      'Completed': { icon: '✅', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'Closed': { icon: '🔒', color: 'bg-gray-100 text-gray-600 border-gray-200' },
      'Rejected': { icon: '❌', color: 'bg-red-50 text-red-700 border-red-200' },
      'open': { icon: '🟢', color: 'bg-slate-100 text-slate-700 border-slate-200' }, // Legacy fallback
      'in-progress': { icon: '🚧', color: 'bg-amber-50 text-amber-700 border-amber-200' }, // Legacy
      'resolved': { icon: '✅', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' } // Legacy
    };
    return configs[status] || configs['Pending'];
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'Low': { icon: '⬇️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      'Medium': { icon: '➡️', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      'High': { icon: '⬆️', color: 'bg-red-50 text-red-700 border-red-200' },
      'low': { icon: '⬇️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      'medium': { icon: '➡️', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      'high': { icon: '⬆️', color: 'bg-red-50 text-red-700 border-red-200' }
    };
    return configs[priority] || configs['Medium'];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Electrical': '⚡',
      'Plumbing': '🚰',
      'Furniture': '🪑',
      'Cleanliness': '🧹',
      'Discipline / Noise': '🤫',
      'Other': '❓',
      'maintenance': '🔧',
      'noise': '🔊',
      'cleanliness': '🧹',
      'food': '🍽️',
      'other': '❓'
    };
    return icons[category] || '📋';
  };

  const handleOpenFeedback = (complaintId) => {
    setSelectedComplaintId(complaintId);
    setFeedbackData({ rating: 5, comment: '' });
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackData.comment?.trim()) {
      return toast.warning('Validation Error', 'Please write a brief comment about the resolution.');
    }
    setSubmittingFeedback(true);
    try {
      const response = await complaintAPI.submitFeedback(selectedComplaintId, feedbackData);
      if (response.success) {
        toast.success('Feedback Submitted', 'Thank you for your feedback! The complaint is now fully closed.');
        setShowFeedbackModal(false);
        fetchComplaints(); // Refresh list to show closed status
      } else {
        toast.error('Submission Failed', response.message || 'Failed to submit feedback');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error submitting feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const content = (
    <>
      <div className="relative max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight mb-2">
              My <span className="text-brand-gold drop-shadow-sm">Complaints</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Track and manage your hostel complaints</p>
          </div>
          <button
            onClick={() => navigate('/create-complaint')}
            className="bg-brand-gold hover:bg-[#e5920f] text-brand-black font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-lg">➕</span>
            <span>New Complaint</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scroll-smooth">
          {['All', 'Active', 'Resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 border ${
                filter === status
                  ? 'bg-brand-navy text-brand-gold border-brand-navy shadow-md ring-1 ring-brand-navy'
                  : 'bg-brand-white/60 text-slate-600 border-brand-platinum/50 hover:bg-brand-white hover:border-brand-platinum hover:shadow-sm'
              }`}
            >
              {status} Complaints
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-brand-platinum/40 border-t-brand-navy rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-medium tracking-wide">Loading your complaints...</p>
            </div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-12 text-center shadow-lg shadow-brand-platinum/20">
            <div className="w-24 h-24 bg-brand-platinum/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📋</span>
            </div>
            <h3 className="text-brand-navy text-2xl font-black mb-2 tracking-tight">No complaints found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto font-medium">
              {filter === 'All' 
                ? "You haven't filed any complaints yet. Everything seems to be working fine!" 
                : `You don't have any ${filter.toLowerCase()} complaints at the moment.`}
            </p>
            {filter !== 'All' && (
              <button
                onClick={() => setFilter('All')}
                className="text-brand-navy hover:text-brand-gold font-bold bg-brand-platinum/10 px-6 py-3 rounded-xl transition-colors hover:bg-brand-navy hover:shadow-md"
              >
                View all complaints →
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredComplaints.map(complaint => {
              const statusConfig = getStatusConfig(complaint.status);
              const priorityConfig = getPriorityConfig(complaint.priority);
              
              return (
                <div
                  key={complaint._id}
                  className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6 relative z-10">
                    
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl bg-brand-platinum/10 p-2 rounded-xl border border-brand-platinum/20 shrink-0">{getCategoryIcon(complaint.category)}</span>
                        <h3 className="text-xl sm:text-2xl font-black text-brand-navy">
                          {complaint.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-4 font-bold">
                        <span className="bg-brand-platinum/20 text-brand-navy px-3 py-1 rounded-lg">ID: {complaint.complaintId}</span>
                        <span>•</span>
                        <span>Posted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                        {complaint.category && (
                          <>
                            <span>•</span>
                            <span className="text-brand-gold">{complaint.category}</span>
                          </>
                        )}
                      </div>

                      <p className="text-slate-600 mb-6 leading-relaxed bg-brand-platinum/5 p-4 rounded-2xl border border-brand-platinum/20 font-medium">
                        {complaint.description}
                      </p>

                      {/* Attached Image */}
                      {complaint.imageUrl && (
                        <div className="mb-6">
                          <p className="text-sm font-semibold text-slate-500 mb-2">Attached Image:</p>
                          <a href={complaint.imageUrl} target="_blank" rel="noreferrer" className="block w-32 h-32 rounded-xl overflow-hidden border border-slate-200 hover:opacity-90 transition">
                            <img src={complaint.imageUrl} alt="Complaint Attachment" className="w-full h-full object-cover" />
                          </a>
                        </div>
                      )}

                      {/* Timeline / Resolution Details */}
                      {complaint.resolution?.workDescription && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-emerald-500">🛠️</span>
                            <h4 className="font-bold text-emerald-800">Resolution Details</h4>
                          </div>
                          <p className="text-emerald-700 text-sm leading-relaxed mb-2">
                            {complaint.resolution.workDescription}
                          </p>
                          <div className="flex gap-4 text-xs font-semibold text-emerald-600/80 mt-3 pt-3 border-t border-emerald-200/50">
                            {complaint.resolution.completedBy && <span>By: {complaint.resolution.completedBy}</span>}
                            {complaint.resolution.completedAt && <span>On: {new Date(complaint.resolution.completedAt).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      )}

                      {complaint.adminResponse && !complaint.resolution && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
                          <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                            <span>👨‍💼</span> Admin Response
                          </h4>
                          <p className="text-blue-800 text-sm leading-relaxed">{complaint.adminResponse}</p>
                        </div>
                      )}

                    </div>

                    {/* Right Side - Status & Actions */}
                    <div className="lg:w-64 flex flex-col gap-3 shrink-0">
                      
                      {/* Status Badges */}
                      <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${statusConfig.color} shadow-sm`}>
                        <span className="text-lg">{statusConfig.icon}</span>
                        <span className="font-bold text-sm tracking-wide">{complaint.status}</span>
                      </div>

                      <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${priorityConfig.color}`}>
                        <span>{getPriorityConfig(complaint.priority).icon}</span>
                        <span className="font-bold text-sm capitalize">{complaint.priority} Priority</span>
                      </div>

                      {/* Expected Completion Date */}
                      {complaint.assignment?.expectedCompletionDate && !['Completed', 'Closed'].includes(complaint.status) && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                          <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Expected By</p>
                          <p className="text-sm font-bold text-slate-700">
                            {new Date(complaint.assignment.expectedCompletionDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {complaint.status === 'Completed' && !complaint.feedback?.rating && (
                        <button
                          onClick={() => handleOpenFeedback(complaint.complaintId || complaint._id)}
                          className="mt-2 w-full bg-brand-gold hover:bg-[#e5920f] text-brand-black font-black py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <span>⭐</span> Provide Feedback
                        </button>
                      )}

                      {/* Show rating if already provided */}
                      {complaint.feedback?.rating && (
                        <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                          <p className="text-xs text-amber-600 font-bold mb-1 uppercase">Your Rating</p>
                          <div className="flex justify-center gap-1">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={star <= complaint.feedback.rating ? "text-amber-500 text-lg" : "text-slate-300 text-lg"}>★</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-brand-platinum/50">
            <div className="bg-brand-navy p-6 text-center border-b border-brand-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                ⭐
              </div>
              <h3 className="text-2xl font-black text-brand-white">Rate Resolution</h3>
              <p className="text-brand-platinum/80 text-sm mt-1 font-medium">Help us improve our service</p>
            </div>
            
            <form onSubmit={handleSubmitFeedback} className="p-6">
              <div className="mb-6">
                <label className="block text-center text-brand-navy font-bold mb-3">How satisfied are you?</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                      className={`text-4xl transition-transform hover:scale-110 focus:outline-none ${
                        star <= feedbackData.rating ? "text-brand-gold drop-shadow-sm" : "text-brand-platinum"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="text-center mt-2 text-sm font-semibold text-slate-500">
                  {feedbackData.rating === 1 && "Very Dissatisfied"}
                  {feedbackData.rating === 2 && "Dissatisfied"}
                  {feedbackData.rating === 3 && "Neutral"}
                  {feedbackData.rating === 4 && "Satisfied"}
                  {feedbackData.rating === 5 && "Very Satisfied"}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-brand-navy text-sm font-bold mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={feedbackData.comment}
                  onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                  placeholder="Tell us what went well or what could be improved..."
                  rows="3"
                  className="w-full px-4 py-3 bg-brand-platinum/10 border border-brand-platinum/30 rounded-xl text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none transition"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 px-4 py-3 bg-brand-white border border-brand-platinum/50 text-brand-navy font-bold rounded-xl hover:bg-brand-platinum/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="flex-1 bg-brand-gold hover:bg-[#e5920f] text-brand-black font-black py-3 px-4 rounded-xl transition shadow-md disabled:bg-brand-gold/50 flex justify-center items-center gap-2"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-brand-platinum/20 relative py-12 px-4 selection:bg-brand-gold/30 selection:text-brand-navy text-brand-black">
      {/* Decorative background blobs for standalone page */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-platinum/50 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-80 h-80 bg-brand-navy/5 rounded-full blur-3xl pointer-events-none" />
      {content}
    </div>
  );
}