import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitComplaint } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Discipline/Noise', 'Internet', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const SubmitComplaintPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        category: '',
        description: '',
        imageUrl: '',
        priority: '',
    });

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await submitComplaint(form);
            toast.success(`Complaint submitted! ID: ${data.complaintId}`);
            navigate('/my-complaints');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const priorityColors = { Low: 'bg-green-100 text-green-700 border-green-300', Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300', High: 'bg-red-100 text-red-700 border-red-300' };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Submit a Complaint</h1>
            <p className="text-sm text-gray-500 mb-6">
                Room {user?.roomNumber} · {user?.hostelBlock}
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {CATEGORIES.map((cat) => (
                            <button key={cat} type="button" onClick={() => setForm((p) => ({ ...p, category: cat }))}
                                className={`border rounded-lg px-3 py-2 text-sm transition ${form.category === cat ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:border-blue-400'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder="Describe the issue in detail (min 10 characters)..." required minLength={10} />
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
                    <input name="imageUrl" value={form.imageUrl} onChange={handleChange} type="url"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://... (paste image link)" />
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority *</label>
                    <div className="flex gap-3">
                        {PRIORITIES.map((p) => (
                            <button key={p} type="button" onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                                className={`flex-1 border rounded-lg py-2 text-sm font-medium transition ${form.priority === p ? priorityColors[p] : 'border-gray-300 hover:border-gray-400'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">High: 4h · Medium: 24h · Low: 72h SLA</p>
                </div>

                <button type="submit" disabled={loading || !form.category || !form.priority}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
            </form>
        </div>
    );
};

export default SubmitComplaintPage;