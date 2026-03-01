import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyComplaints } from '../services/api';
import toast from 'react-hot-toast';

const statusColors = {
    Pending: 'bg-gray-100 text-gray-600',
    Assigned: 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    Closed: 'bg-purple-100 text-purple-700',
    Rejected: 'bg-red-100 text-red-700',
};

const priorityColors = {
    High: 'text-red-600 font-semibold',
    Medium: 'text-yellow-600 font-semibold',
    Low: 'text-green-600 font-semibold',
};

const MyComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getMyComplaints()
            .then(({ data }) => setComplaints(data.data))
            .catch(() => toast.error('Failed to load complaints'))
            .finally(() => setLoading(false));
    }, []);

    const unreadCount = (complaint) =>
        complaint.notifications?.filter((n) => !n.read).length || 0;

    if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Complaints</h1>
                <button onClick={() => navigate('/submit-complaint')}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + New Complaint
                </button>
            </div>

            {complaints.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-3">📋</p>
                    <p>No complaints submitted yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {complaints.map((c) => (
                        <div key={c._id} onClick={() => navigate(`/complaint/${c.complaintId}`)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-gray-400">{c.complaintId}</span>
                                        {unreadCount(c) > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                {unreadCount(c)} new
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="font-semibold text-gray-800">{c.category}</h2>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
                                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[c.status]}`}>
                                        {c.status}
                                    </span>
                                    <span className={`text-xs ${priorityColors[c.priority]}`}>
                                        {c.priority}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                {c.sla?.isBreached && (
                                    <span className="text-red-500 font-medium">🔴 SLA Breached</span>
                                )}
                                {c.sla?.isNearDeadline && !c.sla?.isBreached && (
                                    <span className="text-yellow-500 font-medium">🟡 Near Deadline</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyComplaintsPage;