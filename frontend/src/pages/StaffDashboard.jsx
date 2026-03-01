import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllComplaints, updateProgress, completeComplaint } from '../services/api';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completeModal, setCompleteModal] = useState(null);
    const [completeForm, setCompleteForm] = useState({ workDescription: '', partsUsed: '', cost: 0 });

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const { data } = await getAllComplaints({ limit: 50 });
            setComplaints(data.data);
        } catch {
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const handleMarkInProgress = async (id) => {
        try {
            await updateProgress(id, { note: 'Work started by staff.' });
            toast.success('Marked as In Progress');
            fetchComplaints();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const handleComplete = async () => {
        if (!completeForm.workDescription) {
            toast.error('Work description is required');
            return;
        }
        try {
            await completeComplaint(completeModal, completeForm);
            toast.success('Complaint marked as completed!');
            setCompleteModal(null);
            setCompleteForm({ workDescription: '', partsUsed: '', cost: 0 });
            fetchComplaints();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Complaints</h1>

            {loading ? (
                <p className="text-gray-400 text-center py-10">Loading...</p>
            ) : complaints.length === 0 ? (
                <p className="text-gray-400 text-center py-10">No assigned complaints.</p>
            ) : (
                <div className="space-y-4">
                    {complaints.map((c) => (
                        <div key={c._id} className="bg-white rounded-xl shadow-sm border p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-mono text-gray-400">{c.complaintId}</p>
                                    <h2 className="font-semibold text-gray-800 mt-1">{c.category}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{c.description}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Room {c.student.roomNumber} · {c.student.hostelBlock} · {c.student.name}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${c.priority === 'High' ? 'bg-red-100 text-red-700' : c.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                        {c.priority}
                                    </span>
                                    {c.sla?.isBreached && <span className="text-xs text-red-500">🔴 SLA Breached</span>}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => navigate(`/complaint/${c.complaintId}`)}
                                    className="text-xs text-blue-600 hover:underline">View Details</button>
                                {c.status === 'Assigned' && (
                                    <button onClick={() => handleMarkInProgress(c.complaintId)}
                                        className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition">
                                        Start Work
                                    </button>
                                )}
                                {(c.status === 'Assigned' || c.status === 'In Progress') && (
                                    <button onClick={() => setCompleteModal(c.complaintId)}
                                        className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition">
                                        Mark Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Complete Modal */}
            {completeModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="font-bold text-gray-800 mb-4">Complete Complaint</h2>
                        <div className="space-y-3">
                            <textarea placeholder="Work done description *" required
                                value={completeForm.workDescription}
                                onChange={(e) => setCompleteForm((p) => ({ ...p, workDescription: e.target.value }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm resize-none" rows={3} />
                            <input placeholder="Parts used (optional)"
                                value={completeForm.partsUsed}
                                onChange={(e) => setCompleteForm((p) => ({ ...p, partsUsed: e.target.value }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <input type="number" placeholder="Cost (Rs.)" min={0}
                                value={completeForm.cost}
                                onChange={(e) => setCompleteForm((p) => ({ ...p, cost: Number(e.target.value) }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setCompleteModal(null)} className="flex-1 border rounded-lg py-2 text-sm">Cancel</button>
                            <button onClick={handleComplete} className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm hover:bg-green-700">Complete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;