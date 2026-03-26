import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function AdminComplaints({ isEmbedded = false }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Action Panel State
  const [actionType, setActionType] = useState('update'); // 'update', 'assign', 'reject'
  const [updateForm, setUpdateForm] = useState({ status: '', adminResponse: '', partsUsed: '', cost: 0 });
  const [assignForm, setAssignForm] = useState({ staffName: '', staffId: 'STAFF-001', expectedCompletionDate: '' });
  const [rejectForm, setRejectForm] = useState({ reason: '' });

  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      // Using the new 'getAllComplaints' which takes query params
      const response = await complaintAPI.getAllComplaints({});
      if (response && response.success) {
        setComplaints(response.data || []);
      } else {
        // Fallback to legacy
        const fbParams = filter !== 'All' ? filter : undefined;
        let fbResponse;
        if(fbParams) {
           fbResponse = await complaintAPI.getComplaintsByStatus(fbParams);
        } else {
           // We might not have this method in the service anymore, but just in case
           fbResponse = await complaintAPI.getAllComplaints(); 
        }
        setComplaints(fbResponse?.data || []);
      }
    } catch (err) {
      toast.error('Load Failed', err.message || 'Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setActionType('update');
    setUpdateForm({
      status: complaint.status,
      adminResponse: complaint.adminResponse || '',
      partsUsed: complaint.resolution?.partsUsed || '',
      cost: complaint.resolution?.cost || 0
    });
    setAssignForm({ 
      staffName: complaint.assignment?.staffName || '', 
      staffId: complaint.assignment?.staffId || 'STAFF-001',
      expectedCompletionDate: complaint.assignment?.expectedCompletionDate ? new Date(complaint.assignment.expectedCompletionDate).toISOString().slice(0, 16) : '' 
    });
    setRejectForm({ reason: '' });
  };

  const handleAssignComplaint = async () => {
    if (!selectedComplaint) return;
    if (!assignForm.staffName?.trim()) {
      return toast.warning('Validation Error', 'Please enter the name of the assigned staff member.');
    }
    if (/\d/.test(assignForm.staffName)) {
      return toast.warning('Validation Error', 'Staff name cannot contain numbers.');
    }
    if (!assignForm.expectedCompletionDate) {
      return toast.warning('Validation Error', 'Please select an expected completion date.');
    }

    const selectedDate = new Date(assignForm.expectedCompletionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return toast.warning('Validation Error', 'Expected completion date cannot be in the past.');
    }

    setUpdating(true);
    try {
      const response = await complaintAPI.assignComplaint(selectedComplaint.complaintId || selectedComplaint._id, assignForm);
      if (response && response.success) {
        toast.success('Assigned', `Complaint assigned to ${assignForm.staffName}`);
        fetchComplaints();
        setSelectedComplaint(null);
      } else {
        toast.error('Assignment Failed', response?.message || 'Failed to assign complaint');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error assigning complaint');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    
    if (updateForm.status === 'Completed') {
      if (!updateForm.adminResponse?.trim()) {
        return toast.warning('Validation Error', 'Please provide a work description/note to mark as Completed.');
      }
      if (updateForm.partsUsed?.trim() && /\d/.test(updateForm.partsUsed)) {
        return toast.warning('Validation Error', 'Parts used cannot contain numbers.');
      }
      if (updateForm.cost !== '' && updateForm.cost !== null && updateForm.cost !== undefined) {
        if (Number(updateForm.cost) < 0) {
          return toast.warning('Validation Error', 'Cost cannot be a negative value.');
        }
      }
    }
    if (updateForm.status === 'In Progress' && !updateForm.adminResponse?.trim()) {
      return toast.warning('Validation Error', 'Please provide an update note to mark as In Progress.');
    }

    setUpdating(true);
    try {
      let response;
      const cid = selectedComplaint.complaintId || selectedComplaint._id;
      
      if (updateForm.status === 'Completed') {
        response = await complaintAPI.completeComplaint(cid, {
          workDescription: updateForm.adminResponse || 'Completed by admin',
          partsUsed: updateForm.partsUsed || '',
          cost: Number(updateForm.cost) || 0
        });
      } else if (updateForm.status === 'In Progress') {
        response = await complaintAPI.updateProgress(cid, {
          note: updateForm.adminResponse || 'Marked in progress by admin'
        });
      } else {
         response = { success: false, message: 'Must use new advanced assignment flow.' };
      }

      if (response && response.success) {
        toast.success('Status Updated', 'The complaint status has been successfully updated.');
        fetchComplaints();
        setSelectedComplaint(null);
      } else {
        toast.error('Update Failed', response?.message || 'Failed to update status.');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteComplaint = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) return;
    try {
      const response = await complaintAPI.deleteComplaint(selectedComplaint._id);
      if (response && response.success) {
        toast.success('Deleted', 'Complaint deleted successfully!');
        fetchComplaints();
        setSelectedComplaint(null);
      } else {
        toast.error('Delete Failed', response?.message || 'Failed to delete complaint');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Error deleting complaint');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-slate-100 text-slate-700 border-slate-200',
      'Assigned': 'bg-blue-100 text-blue-700 border-blue-200',
      'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
      'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Closed': 'bg-gray-100 text-gray-600 border-gray-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200',
      'open': 'bg-slate-100 text-slate-700',
      'in-progress': 'bg-amber-100 text-amber-700',
      'resolved': 'bg-emerald-100 text-emerald-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Electrical': '⚡', 'Plumbing': '🚰', 'Furniture': '🪑',
      'Cleanliness': '🧹', 'Discipline / Noise': '🤫', 'Other': '❓',
      'maintenance': '🔧', 'noise': '🔊', 'cleanliness': '🧹', 'food': '🍽️', 'other': '❓'
    };
    return icons[category] || '📋';
  };

  const filteredComplaints = complaints.filter(c => {
    const title = c.title || c.description || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.complaintId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filter === 'All') return true;
    if (filter === 'SLA Breached') return c.sla?.isBreached;
    if (filter === 'Unassigned') return c.status === 'Pending' || c.status === 'open';
    if (filter === 'Active') return ['Pending', 'Assigned', 'In Progress', 'open', 'in-progress'].includes(c.status);
    return c.status === filter;
  });

  const statCounts = {
    all: complaints.length,
    active: complaints.filter(c => ['Pending', 'Assigned', 'In Progress', 'open', 'in-progress'].includes(c.status)).length,
    unassigned: complaints.filter(c => c.status === 'Pending' || c.status === 'open').length,
    breached: complaints.filter(c => c.sla?.isBreached).length
  };

  const content = (
    <div className="relative max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight mb-3">
            Manage <span className="text-brand-gold drop-shadow-sm">Complaints</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Administer hostel complaints, assignments, and SLAs</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-6 shadow-lg shadow-brand-platinum/20 hover:shadow-xl transition-shadow">
            <p className="text-brand-navy/60 text-sm font-black uppercase tracking-wider mb-2">Total Complaints</p>
            <p className="text-4xl font-black text-brand-navy">{statCounts.all}</p>
          </div>
          <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-6 shadow-lg shadow-brand-platinum/20 hover:shadow-xl transition-shadow">
             <p className="text-amber-500 text-sm font-black uppercase tracking-wider mb-2">Active Issues</p>
            <p className="text-4xl font-black text-amber-600">{statCounts.active}</p>
          </div>
          <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-6 shadow-lg shadow-brand-platinum/20 hover:shadow-xl transition-shadow">
             <p className="text-sky-500 text-sm font-black uppercase tracking-wider mb-2">Awaiting Assign</p>
            <p className="text-4xl font-black text-sky-600">{statCounts.unassigned}</p>
          </div>
          <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-6 shadow-lg shadow-brand-platinum/20 hover:shadow-xl transition-shadow relative overflow-hidden">
             {statCounts.breached > 0 && <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-100 rounded-full animate-pulse" />}
             <p className="text-rose-500 text-sm font-black uppercase tracking-wider mb-2 relative z-10">SLA Breached</p>
            <p className="text-4xl font-black text-rose-600 relative z-10">{statCounts.breached}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title, ID, or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-4 bg-brand-white border border-brand-platinum/50 rounded-2xl text-brand-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold shadow-sm transition"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400">🔍</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 items-center">
            {['All', 'Active', 'Unassigned', 'SLA Breached', 'Completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                  filter === f
                    ? 'bg-brand-navy text-brand-gold border-brand-navy shadow-md ring-1 ring-brand-navy'
                    : 'bg-brand-white/60 text-slate-600 border-brand-platinum/50 hover:bg-brand-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Complaints List */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-brand-platinum/40 border-t-brand-navy rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-500 font-medium tracking-wide">Loading complaints...</p>
                </div>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-16 text-center shadow-lg shadow-brand-platinum/20">
                <div className="w-24 h-24 bg-brand-platinum/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">📭</span>
                </div>
                <h3 className="text-brand-navy text-2xl font-black mb-2 tracking-tight">No complaints found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredComplaints.map(complaint => (
                <div
                  key={complaint._id}
                  onClick={() => handleSelectComplaint(complaint)}
                  className={`bg-brand-white border rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedComplaint?._id === complaint._id
                      ? 'border-brand-gold ring-2 ring-brand-gold/50 shadow-md bg-brand-gold/5'
                      : 'border-brand-platinum/50 hover:border-brand-navy/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl bg-brand-platinum/10 p-2 rounded-xl border border-brand-platinum/20 shrink-0">
                          {getCategoryIcon(complaint.category)}
                        </span>
                        <div>
                          <h3 className="font-bold text-brand-navy text-lg truncate hover:text-brand-gold transition">
                            {complaint.title || complaint.description?.substring(0, 60) || 'No title'}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                             <span className="font-bold text-slate-700">{complaint.complaintId}</span>
                             <span>•</span>
                             <span className="truncate">{complaint.student?.name} ({complaint.student?.roomNumber})</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-sm line-clamp-2 mt-3 leading-relaxed">
                        {complaint.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg capitalize border border-slate-200">
                          {complaint.priority} Priority
                        </span>
                        {complaint.sla?.isBreached && (
                          <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                            ⚠️ SLA Breached
                          </span>
                        )}
                        {complaint.assignment?.staffName && (
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                            👨‍🔧 {complaint.assignment.staffName}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
            {selectedComplaint ? (
              <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-6rem)] relative z-30">
                
                {/* Header */}
                <div className="bg-brand-platinum/10 border-b border-brand-platinum/50 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-xl text-brand-navy flex items-center gap-2">
                       {selectedComplaint.complaintId}
                    </h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                  
                  {/* Student Info */}
                  <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Reported By</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800 text-lg leading-tight">{selectedComplaint.student?.name}</p>
                        <p className="text-sm text-slate-500">{selectedComplaint.student?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Location</p>
                        <p className="font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm mt-1">
                          {selectedComplaint.student?.roomNumber || 'N/A'} - {selectedComplaint.student?.hostelBlock || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Complaint Details */}
                  <div className="mb-6">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Complaint Details</p>
                    <h4 className="font-bold text-slate-800 mb-2">{selectedComplaint.title || selectedComplaint.description?.substring(0, 80) || 'Untitled Complaint'}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedComplaint.description}
                    </p>
                    
                    {selectedComplaint.imageUrl && (
                      <a href={selectedComplaint.imageUrl} target="_blank" rel="noreferrer" className="block w-full h-40 rounded-xl overflow-hidden border border-slate-200 hover:opacity-90 transition mb-4">
                        <img src={selectedComplaint.imageUrl} alt="Attachment" className="w-full h-full object-cover" />
                      </a>
                    )}
                  </div>

                  {/* SLA Warning */}
                  {selectedComplaint.sla && (
                    <div className={`mb-6 p-4 rounded-xl border ${selectedComplaint.sla.isBreached ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold uppercase tracking-wider text-xs">SLA Target</span>
                        {selectedComplaint.sla.isBreached && <span className="text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-bold">BREACHED</span>}
                      </div>
                      <p className="font-semibold text-sm">
                        {new Date(selectedComplaint.sla.deadline).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Assignment Details View */}
                  {selectedComplaint.assignment?.staffName && (
                     <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-2">Assigned To</p>
                        <p className="font-bold text-blue-900">{selectedComplaint.assignment.staffName}</p>
                        {selectedComplaint.assignment.expectedCompletionDate && (
                          <p className="text-sm text-blue-700 mt-1">Expected: {new Date(selectedComplaint.assignment.expectedCompletionDate).toLocaleString()}</p>
                        )}
                     </div>
                  )}

                  <hr className="my-6 border-slate-200" />

                  {/* Action Tabs */}
                  <div className="flex gap-2 mb-4 bg-brand-platinum/20 p-1.5 rounded-xl">
                    <button 
                      onClick={() => setActionType('assign')} 
                      className={`flex-1 text-sm font-bold py-2.5 rounded-lg transition-all ${actionType === 'assign' ? 'bg-brand-white shadow-md text-brand-navy' : 'text-slate-500 hover:text-brand-navy'}`}
                    >
                      Assign
                    </button>
                    <button 
                      onClick={() => setActionType('update')} 
                      className={`flex-1 text-sm font-bold py-2.5 rounded-lg transition-all ${actionType === 'update' ? 'bg-brand-white shadow-md text-brand-navy' : 'text-slate-500 hover:text-brand-navy'}`}
                    >
                      Update
                    </button>
                  </div>

                  {/* Actions Area */}
                  {actionType === 'assign' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Assign to Staff Name</label>
                        <input
                          type="text"
                          value={assignForm.staffName}
                          onChange={(e) => setAssignForm({ ...assignForm, staffName: e.target.value })}
                          placeholder="E.g. John Doe - Electrician"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Expected Completion</label>
                        <input
                          type="datetime-local"
                          value={assignForm.expectedCompletionDate}
                          onChange={(e) => setAssignForm({ ...assignForm, expectedCompletionDate: e.target.value })}
                          className="w-full px-4 py-3 bg-brand-white border border-brand-platinum/50 rounded-xl text-brand-black focus:ring-2 focus:ring-brand-gold transition"
                        />
                      </div>
                      <button
                        onClick={handleAssignComplaint}
                        disabled={updating || !assignForm.staffName}
                        className="w-full bg-brand-gold hover:bg-[#e5920f] disabled:bg-brand-gold/50 text-brand-black font-black py-4 rounded-xl transition shadow-md hover:shadow-lg flex justify-center items-center gap-2"
                      >
                        {updating ? 'Processing...' : 'Assign Complaint'}
                      </button>
                    </div>
                  )}

                  {actionType === 'update' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Status</label>
                        <select
                          value={updateForm.status}
                          onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 transition appearance-none"
                        >
                          <option value="open">🔴 Open (Legacy)</option>
                          <option value="Pending">⏳ Pending</option>
                          <option value="Assigned">👨‍🔧 Assigned</option>
                          <option value="In Progress">🚧 In Progress</option>
                          <option value="Completed">✅ Completed</option>
                          <option value="Closed">🔒 Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Admin Response / Work Description</label>
                        <textarea
                          value={updateForm.adminResponse}
                          onChange={(e) => setUpdateForm({ ...updateForm, adminResponse: e.target.value })}
                          placeholder={updateForm.status === 'Completed' ? "Describe the exact work that was done..." : "Write a note to the student/staff..."}
                          rows="3"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 transition resize-none"
                        />
                      </div>
                      
                      {updateForm.status === 'Completed' && (
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Parts Used</label>
                            <input
                              type="text"
                              value={updateForm.partsUsed}
                              onChange={(e) => setUpdateForm({ ...updateForm, partsUsed: e.target.value })}
                              placeholder="E.g. 1x Bulb"
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 transition"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Cost ($)</label>
                            <input
                              type="number"
                              min="0"
                              value={updateForm.cost}
                              onChange={(e) => setUpdateForm({ ...updateForm, cost: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 transition"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-brand-platinum/30">
                        <button
                          onClick={handleUpdateStatus}
                          disabled={updating}
                          className="w-full bg-brand-gold hover:bg-[#e5920f] disabled:bg-brand-gold/50 text-brand-black font-black py-4 rounded-xl transition shadow-md hover:shadow-lg"
                        >
                          {updating ? 'Updating...' : 'Update Status'}
                        </button>
                        <button
                          onClick={handleDeleteComplaint}
                          className="w-full bg-brand-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold py-4 rounded-xl transition-all"
                        >
                          Delete Legacy Complaint
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="bg-brand-white border border-brand-platinum/50 rounded-3xl p-12 text-center shadow-lg shadow-brand-platinum/20 sticky top-6">
                <div className="w-24 h-24 bg-brand-platinum/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">👆</span>
                </div>
                <h3 className="text-brand-navy text-xl font-black mb-2 tracking-tight">Select a Complaint</h3>
                <p className="text-slate-500 font-medium">Click on any complaint from the list to view its details and take action.</p>
              </div>
            )}
          </div>

        </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-brand-platinum/20 relative overflow-hidden py-12 px-4 selection:bg-brand-gold/30 selection:text-brand-navy text-brand-black">
      {/* Decorative background blobs for standalone page */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-platinum/50 to-transparent pointer-events-none" />
      <div className="absolute top-20 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      {content}
    </div>
  );
}