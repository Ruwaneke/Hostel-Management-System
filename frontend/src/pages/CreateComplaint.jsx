import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { complaintAPI } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';

export default function CreateComplaint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    roomNumber: '',
    hostelBlock: '',
    title: '',
    description: '',
    category: 'Electrical',
    priority: 'Medium'
  });
  const [imageFile, setImageFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const categories = [
    { value: 'Electrical', icon: '⚡', label: 'Electrical' },
    { value: 'Plumbing', icon: '🚰', label: 'Plumbing' },
    { value: 'Furniture', icon: '🪑', label: 'Furniture' },
    { value: 'Cleanliness', icon: '🧹', label: 'Cleanliness' },
    { value: 'Discipline / Noise', icon: '🤫', label: 'Noise' },
    { value: 'Other', icon: '❓', label: 'Other' }
  ];

  const priorities = [
    { value: 'Low', label: 'Low', color: 'from-blue-100 to-cyan-100 text-blue-700 border-blue-200 hover:border-blue-400' },
    { value: 'Medium', label: 'Medium', color: 'from-amber-100 to-yellow-100 text-amber-700 border-amber-200 hover:border-amber-400' },
    { value: 'High', label: 'High', color: 'from-rose-100 to-red-100 text-red-700 border-red-200 hover:border-red-400' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate room number
    if (!formData.roomNumber?.trim()) {
      return toast.warning('Validation Error', 'Please enter your room number.');
    }

    // Validate hostel block
    if (!formData.hostelBlock?.trim()) {
      return toast.warning('Validation Error', 'Please enter your hostel block.');
    }

    if (!formData.description?.trim()) {
      return toast.warning('Validation Error', 'Please describe the issue in detail.');
    }
    if (/\d/.test(formData.description)) {
      return toast.warning('Validation Error', 'Description cannot contain numbers.');
    }
    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      return toast.warning('Validation Error', 'Image size must be less than 5MB.');
    }
    if (!formData.title?.trim()) {
      formData.title = formData.category + ' Issue'; 
    }
    if (/\d/.test(formData.title)) {
      return toast.warning('Validation Error', 'Title cannot contain numbers.');
    }

    setLoading(true);
    
    try {
      const submissionData = new FormData();
      submissionData.append('roomNumber', formData.roomNumber.trim());
      submissionData.append('hostelBlock', formData.hostelBlock.trim());
      submissionData.append('title', formData.title.trim());
      submissionData.append('description', formData.description.trim());
      submissionData.append('category', formData.category);
      submissionData.append('priority', formData.priority);
      if (imageFile) {
        submissionData.append('image', imageFile);
      }

      const response = await complaintAPI.createComplaint(submissionData);

      if (response && response.success) {
        toast.success('Complaint Registered', 'Your request has been filed successfully.');
        navigate('/user/dashboard');
      } else {
        toast.error('Submission Failed', response?.message || 'Failed to submit complaint');
      }
    } catch (err) {
      toast.error('Error', err.message || 'Server error while submitting complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-platinum/20 relative py-12 px-4 selection:bg-brand-gold/30 selection:text-brand-navy text-brand-black">
      
      {/* Decorative background blobs for light theme */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-platinum/50 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-80 h-80 bg-brand-navy/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight mb-4">
            Report an <span className="text-brand-gold drop-shadow-sm">Issue</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Help us maintain a great living environment. Describe your issue below and our maintenance team will look into it.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-brand-white rounded-3xl p-8 sm:p-10 border border-brand-platinum/50 shadow-lg shadow-brand-platinum/20 hover:shadow-xl transition-shadow duration-300">
          

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Room Number and Hostel Block Section */}
            <div>
              <label className="block text-brand-navy font-black text-lg mb-4 tracking-tight">
                Location Details <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Room Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    placeholder="E.g., 204"
                    maxLength="20"
                    className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl text-brand-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Hostel Block <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hostelBlock"
                    value={formData.hostelBlock}
                    onChange={handleChange}
                    placeholder="E.g., Block A"
                    maxLength="50"
                    className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl text-brand-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-brand-navy font-black text-lg mb-4 tracking-tight">
                What type of issue is this? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-4 rounded-2xl transition-all duration-300 border flex items-center gap-3 ${
                      formData.category === cat.value
                        ? 'bg-brand-navy border-brand-navy text-brand-gold shadow-md ring-1 ring-brand-navy'
                        : 'bg-brand-white/60 border-brand-platinum/50 text-slate-600 hover:bg-brand-white hover:border-brand-platinum hover:shadow-sm'
                    }`}
                  >
                    <span className="text-2xl bg-brand-platinum/10 p-2 rounded-xl shadow-sm border border-brand-platinum/20">{cat.icon}</span>
                    <span className="font-bold">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-brand-navy font-bold text-lg mb-2">
                Short Title <span className="text-rose-500">*</span>
              </label>
              <p className="text-slate-500 text-sm mb-3 font-medium">A brief summary of the problem.</p>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., Leaking tap in Room 204"
                maxLength="100"
                required
                className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl text-brand-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all shadow-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-brand-navy font-bold text-lg mb-2">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <p className="text-slate-500 text-sm mb-3 font-medium">Provide as much detail as possible to help us resolve it quickly.</p>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe exactly what happened, where it is, and since when..."
                rows="4"
                required
                className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl text-brand-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all resize-none shadow-sm"
              />
            </div>

            {/* Image (Optional File Upload) */}
            <div>
              <label className="block text-brand-navy font-bold text-lg mb-2">
                Upload Image <span className="text-slate-400 text-sm font-normal ml-2">(Optional, Max 5MB)</span>
              </label>
              <p className="text-slate-500 text-sm mb-3 font-medium">Upload a clear photo of the issue so our team can prepare the right tools.</p>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    if (file) setFilePreview(URL.createObjectURL(file));
                    else setFilePreview(null);
                  }}
                  className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl text-brand-black file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-brand-navy file:text-brand-gold hover:file:bg-brand-navy/90 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold cursor-pointer"
                />
              </div>
              
              {filePreview && (
                <div className="mt-4 relative inline-block">
                  <img src={filePreview} alt="Preview" className="h-32 rounded-xl border border-slate-200 object-cover shadow-sm" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setFilePreview(null); }}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md hover:bg-rose-600 transition"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-brand-navy font-bold text-lg mb-4">
                How urgent is this?
              </label>
              <div className="grid grid-cols-3 gap-4">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p.value })}
                    className={`px-4 py-4 rounded-2xl transition-all duration-300 font-bold border-2 flex flex-col items-center justify-center gap-1 ${
                      formData.priority === p.value
                        ? `bg-gradient-to-br ${p.color} ring-2 ring-offset-2 ring-${p.value.toLowerCase() === 'low' ? 'blue' : p.value.toLowerCase() === 'medium' ? 'amber' : 'red'}-400 shadow-md`
                        : 'bg-brand-white border-brand-platinum/50 text-slate-500 hover:bg-brand-platinum/10'
                    }`}
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-10 border-t border-brand-platinum/30">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-4 bg-brand-white text-brand-navy font-bold rounded-2xl border border-brand-platinum/50 hover:bg-brand-platinum/20 transition-all focus:outline-none focus:ring-2 focus:ring-brand-platinum shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-brand-gold hover:bg-[#e5920f] disabled:bg-brand-gold/50 text-brand-black font-black py-4 px-6 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-brand-black/40 border-t-brand-black rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🚀</span>
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 mb-12 bg-brand-navy border border-brand-white/10 rounded-3xl p-6 shadow-xl flex items-start gap-4">
          <div className="bg-brand-gold/20 p-2 rounded-full text-brand-gold text-lg">
            ℹ️
          </div>
          <div>
            <h4 className="text-brand-gold font-bold mb-1">What happens next?</h4>
            <p className="text-brand-platinum/80 text-sm leading-relaxed font-medium">
              Once submitted, your complaint is routed to the corresponding department. High priority issues are typically addressed within 4 hours, and standard issues within 24-48 hours. You'll receive updates here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}