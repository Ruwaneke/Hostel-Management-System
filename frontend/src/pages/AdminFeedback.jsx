import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/feedbackService';
import { useToast } from '../components/Toast';

export default function AdminFeedback({ isEmbedded = false }) {
  const [feedbacks, setFeedbacks]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const { toast }                       = useToast();
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCat, setFilterCat]       = useState('All');
  const [searchTerm, setSearchTerm]     = useState('');
  const [selected, setSelected]         = useState(null);
  const [updating, setUpdating]         = useState(false);
  const [stats, setStats]               = useState({ avgRating: 0, total: 0, reviewed: 0 });
  const [responseForm, setResponseForm] = useState({ status: 'Reviewed', adminResponse: '' });

  const categories = ['All', 'General', 'Food & Mess', 'Room Facilities', 'Cleanliness', 'Security', 'Other'];
  const statuses   = ['All', 'Pending', 'Reviewed', 'Action Taken'];

  useEffect(() => { fetchFeedback(); }, [filterStatus, filterCat]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await feedbackAPI.getAllFeedback({ status: filterStatus, category: filterCat });
      if (res.success) {
        setFeedbacks(res.data || []);
        setStats(res.stats || { avgRating: 0, total: 0, reviewed: 0 });
      } else {
        toast.error('Load Failed', res.message || 'Failed to fetch feedback');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error fetching feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (fb) => {
    setSelected(fb);
    setResponseForm({ status: fb.status, adminResponse: fb.adminResponse || '' });
  };

  const handleUpdate = async () => {
    if (!selected) return;
    
    if (responseForm.status === 'Action Taken' && !responseForm.adminResponse?.trim()) {
      return toast.warning('Validation Error', 'Please write a response to the user before marking as Action Taken.');
    }

    setUpdating(true);
    try {
      const res = await feedbackAPI.updateFeedbackStatus(selected._id, responseForm);
      if (res.success) {
        toast.success('Response Saved', 'Feedback updated successfully!');
        setSelected(null);
        fetchFeedback();
      } else {
        toast.error('Update Failed', res.message || 'Failed to update feedback');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error updating feedback');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback entry?')) return;
    try {
      const res = await feedbackAPI.deleteFeedback(id);
      if (res.success) {
        toast.success('Deleted', 'Feedback entry removed.');
        setSelected(null);
        fetchFeedback();
      } else {
        toast.error('Delete Failed', res.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error deleting feedback');
    }
  };

  const starColor = (n) => n >= 4 ? 'text-emerald-500' : n === 3 ? 'text-amber-500' : 'text-rose-500';

  const filtered = feedbacks.filter(fb => {
    const q = searchTerm.toLowerCase();
    return (
      fb.title?.toLowerCase().includes(q) ||
      fb.student?.name?.toLowerCase().includes(q) ||
      fb.student?.roomNumber?.toLowerCase().includes(q)
    );
  });

  const content = (
    <div className="relative max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight mb-3">
          Student <span className="text-brand-gold drop-shadow-sm">Feedback</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">Review and respond to student feedback</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Feedback',  value: stats.total,                                            color: 'text-brand-navy',   bg: 'bg-brand-navy/5'    },
          { label: 'Avg Rating',      value: `${Number(stats.avgRating || 0).toFixed(1)} ★`,        color: 'text-brand-gold',   bg: 'bg-brand-gold/10'   },
          { label: 'Reviewed',        value: stats.reviewed,                                          color: 'text-emerald-600',  bg: 'bg-emerald-50'      },
          { label: 'Pending Review',  value: (stats.total || 0) - (stats.reviewed || 0),             color: 'text-amber-600',    bg: 'bg-amber-50'        },
        ].map(s => (
          <div key={s.label} className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-6 shadow-lg shadow-brand-platinum/20 hover:shadow-xl transition-shadow">
            <p className="text-slate-500 text-sm font-black uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title, student name, or room..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-4 bg-brand-white border border-brand-platinum/50 rounded-2xl text-brand-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold shadow-sm transition"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400">🔍</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center shrink-0">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-brand-white border border-brand-platinum/50 rounded-2xl text-brand-navy font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold shadow-sm"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="px-4 py-3 bg-brand-white border border-brand-platinum/50 rounded-2xl text-brand-navy font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold shadow-sm"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">

        {/* Feedback List */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-14 h-14 border-4 border-brand-platinum/40 border-t-brand-navy rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-14 text-center shadow-lg">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-brand-navy text-xl font-black mb-2">No feedback found</h3>
              <p className="text-slate-500">Try adjusting your filters or search term</p>
            </div>
          ) : (
            filtered.map(fb => (
              <div
                key={fb._id}
                onClick={() => handleSelect(fb)}
                className={`bg-brand-white border rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selected?._id === fb._id
                    ? 'border-brand-gold ring-2 ring-brand-gold/50 shadow-md bg-brand-gold/5'
                    : 'border-brand-platinum/50 hover:border-brand-navy/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        fb.status === 'Pending'     ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        fb.status === 'Reviewed'    ? 'bg-sky-100 text-sky-700 border-sky-200' :
                                                       'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}>{fb.status}</span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{fb.category}</span>
                      <span className="text-xs text-slate-400 font-semibold">{new Date(fb.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-brand-navy text-lg mb-1 truncate">{fb.title}</h4>
                    <p className="text-slate-600 text-sm line-clamp-2">{fb.description}</p>
                    <div className="flex items-center gap-1 mt-3">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-lg ${s <= fb.rating ? starColor(fb.rating) : 'text-slate-200'}`}>★</span>
                      ))}
                      <span className="ml-2 text-sm font-bold text-slate-500">{fb.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 sm:w-32 text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Student</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{fb.student?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{fb.student?.roomNumber && `Room ${fb.student.roomNumber}`}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail / Action Panel */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
          {selected ? (
            <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-6rem)]">
              {/* Panel Header */}
              <div className="bg-brand-platinum/10 border-b border-brand-platinum/50 p-6">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <h3 className="font-black text-xl text-brand-navy leading-tight">{selected.title}</h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-slate-400 hover:text-slate-700 transition text-xl flex-shrink-0"
                  >✕</button>
                </div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* Student Info */}
                <div className="mb-5 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Submitted By</p>
                  <p className="font-bold text-slate-800 text-base">{selected.student?.name}</p>
                  <p className="text-sm text-slate-500">{selected.student?.email}</p>
                  {selected.student?.roomNumber && (
                    <span className="inline-block mt-2 bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                      Room {selected.student.roomNumber} · {selected.student?.hostelBlock || ''}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="mb-5">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Rating Given</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-2xl ${s <= selected.rating ? starColor(selected.rating) : 'text-slate-200'}`}>★</span>
                    ))}
                    <span className="ml-2 font-black text-slate-700">{selected.rating}/5</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-5">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Feedback</p>
                  <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selected.description}
                  </p>
                </div>

                <hr className="my-4 border-brand-platinum/30" />

                {/* Action Form */}
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Admin Action</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Update Status</label>
                    <select
                      value={responseForm.status}
                      onChange={e => setResponseForm({ ...responseForm, status: e.target.value })}
                      className="w-full px-4 py-3 bg-brand-platinum/10 border border-brand-platinum/30 rounded-xl text-brand-black font-semibold focus:outline-none focus:ring-2 focus:ring-brand-gold transition"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Reviewed">👀 Reviewed</option>
                      <option value="Action Taken">✅ Action Taken</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Response to Student</label>
                    <textarea
                      rows="4"
                      value={responseForm.adminResponse}
                      onChange={e => setResponseForm({ ...responseForm, adminResponse: e.target.value })}
                      placeholder="Write your response or note to the student..."
                      className="w-full px-4 py-3 bg-brand-platinum/10 border border-brand-platinum/30 rounded-xl text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-gold transition resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-3 border-t border-brand-platinum/30">
                    <button
                      onClick={handleUpdate}
                      disabled={updating}
                      className="w-full bg-brand-gold hover:bg-[#e5920f] disabled:opacity-60 text-brand-black font-black py-4 rounded-xl transition shadow-md hover:shadow-lg"
                    >
                      {updating ? 'Saving...' : '💾 Save Response'}
                    </button>
                    <button
                      onClick={() => handleDelete(selected._id)}
                      className="w-full bg-brand-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold py-3.5 rounded-xl transition"
                    >
                      🗑️ Delete Entry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-12 text-center shadow-lg sticky top-6">
              <div className="w-20 h-20 bg-brand-platinum/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👆</span>
              </div>
              <h3 className="text-brand-navy text-xl font-black mb-2">Select a Feedback</h3>
              <p className="text-slate-500 font-medium">Click any entry to view details and respond</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  if (isEmbedded) return <>{content}</>;

  return (
    <div className="min-h-screen bg-brand-platinum/20 relative overflow-hidden py-12 px-4 selection:bg-brand-gold/30 selection:text-brand-navy text-brand-black">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-platinum/50 to-transparent pointer-events-none" />
      <div className="absolute top-20 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      {content}
    </div>
  );
}
