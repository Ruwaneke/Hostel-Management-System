import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById, submitFeedback, markNotificationsRead } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusColors = {
    Pending: 'bg-gray-100 text-gray-600',
    Assigned: 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    Closed: 'bg-purple-100 text-purple-700',
    Rejected: 'bg-red-100 text-red-700',
};

const ComplaintDetailPage = () => {
    const { complaintId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ rating: '', comment: '' });
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const fetchComplaint = async () => {
        try {
            const { data } = await getComplaintById(complaintId);
            setComplaint(data.data);
        } catch {
            toast.error('Complaint not found');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaint();
    }, [complaintId]);

    useEffect(() => {
        if (complaint && user?.role === 'student') {
            const hasUnread = complaint.notifications?.some((n) => !n.read);
            if (hasUnread) markNotificationsRead(complaintId).catch(() => {});
        }
    }, [complaint]);

    const handleFeedback = async (e) => {
        e.preventDefault();
        setSubmittingFeedback(true);
        try {
            await submitFeedback(complaintId, feedback);
            toast.success('Feedback submitted!');
            fetchComplaint();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
    if (!complaint) return null;

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-5">
            <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">← Back</button>

            {/* Header */}
            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs font-mono text-gray-400">{complaint.complaintId}</p>
                        <h1 className="text-xl font-bold text-gray-800 mt-1">{complaint.category}</h1>
                        <p className="text-sm text-gray-500 mt-1">{complaint.description}</p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${statusColors[complaint.status]}`}>
                        {complaint.status}
                    </span>
                </div>
                {complaint.imageUrl && (
                    <img src={complaint.imageUrl} alt="Complaint" className="rounded-lg w-full max-h-64 object-cover mt-3" />
                )}
                <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-gray-500 border-t pt-4">
                    <div><p className="font-semibold text-gray-700">Priority</p><p>{complaint.priority}</p></div>
                    <div><p className="font-semibold text-gray-700">Submitted</p><p>{new Date(complaint.createdAt).toLocaleString()}</p></div>
                    <div>
                        <p className="font-semibold text-gray-700">SLA Deadline</p>
                        <p>{new Date(complaint.sla.deadline).toLocaleString()}</p>
                        {complaint.sla.isBreached && <p className="text-red-500 font-medium">🔴 Breached</p>}
                        {complaint.sla.isNearDeadline && <p className="text-yellow-500 font-medium">🟡 Near Deadline</p>}
                    </div>
                </div>
            </div>

            {/* Assignment */}
            {complaint.assignment?.staffName && (
                <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-800 mb-2">Assignment</p>
                    <p className="text-sm text-blue-700">Assigned to: <strong>{complaint.assignment.staffName}</strong></p>
                    {complaint.assignment.expectedCompletionDate && (
                        <p className="text-sm text-blue-600 mt-1">
                            Expected: {new Date(complaint.assignment.expectedCompletionDate).toLocaleString()}
                        </p>
                    )}
                </div>
            )}

            {/* Resolution */}
            {complaint.resolution?.workDescription && (
                <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-green-800 mb-2">Work Completed</p>
                    <p className="text-sm text-green-700">{complaint.resolution.workDescription}</p>
                    {complaint.resolution.partsUsed && <p className="text-xs text-green-600 mt-1">Parts: {complaint.resolution.partsUsed}</p>}
                    {complaint.resolution.cost > 0 && <p className="text-xs text-green-600">Cost: Rs. {complaint.resolution.cost}</p>}
                    <p className="text-xs text-green-500 mt-1">By {complaint.resolution.completedBy} · {new Date(complaint.resolution.completedAt).toLocaleString()}</p>
                </div>
            )}

            {/* Feedback Form */}
            {complaint.status === 'Completed' && user?.role === 'student' && !complaint.feedback?.rating && (
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold text-gray-800 mb-4">Rate this Resolution</h2>
                    <form onSubmit={handleFeedback} className="space-y-4">
                        <div className="flex gap-4">
                            {['satisfied', 'not_satisfied'].map((r) => (
                                <button key={r} type="button" onClick={() => setFeedback((p) => ({ ...p, rating: r }))}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${feedback.rating === r ? r === 'satisfied' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500' : 'border-gray-300'}`}>
                                    {r === 'satisfied' ? '⭐ Satisfied' : '😞 Not Satisfied'}
                                </button>
                            ))}
                        </div>
                        <textarea value={feedback.comment} onChange={(e) => setFeedback((p) => ({ ...p, comment: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3} placeholder="Optional comments..." />
                        <button type="submit" disabled={!feedback.rating || submittingFeedback}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition text-sm font-medium">
                            {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            )}

            {/* Feedback result */}
            {complaint.feedback?.rating && (
                <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-purple-800">Your Feedback</p>
                    <p className="text-sm text-purple-700 mt-1">
                        {complaint.feedback.rating === 'satisfied' ? '⭐ Satisfied' : '😞 Not Satisfied'}
                        {complaint.feedback.comment && ` — "${complaint.feedback.comment}"`}
                    </p>
                </div>
            )}

            {/* Notifications */}
            {complaint.notifications?.length > 0 && (
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold text-gray-800 mb-3">Notifications</h2>
                    <div className="space-y-2">
                        {[...complaint.notifications].reverse().map((n, i) => (
                            <div key={i} className={`text-sm p-3 rounded-lg ${n.read ? 'bg-gray-50 text-gray-500' : 'bg-blue-50 text-blue-700'}`}>
                                <p>{n.message}</p>
                                <p className="text-xs mt-1 opacity-70">{new Date(n.sentAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Status History */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="font-semibold text-gray-800 mb-3">Status History</h2>
                <div className="space-y-3">
                    {complaint.statusHistory.map((s, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">{s.status}</p>
                                {s.note && <p className="text-xs text-gray-500">{s.note}</p>}
                                <p className="text-xs text-gray-400">{new Date(s.changedAt).toLocaleString()} · {s.changedBy.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailPage;