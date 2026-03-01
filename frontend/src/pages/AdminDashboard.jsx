import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllComplaints, assignComplaint, rejectComplaint, getSLABreached } from '../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['', 'Pending', 'Assigned', 'In Progress', 'Completed', 'Closed', 'Rejected'];
const PRIORITIES = ['', 'High', 'Medium', 'Low'];

const statusColors = {
    Pending: 'bg-gray-100 text-gray-600',
    Assigned: 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    Closed: 'bg-purple-100 text-purple-700',
    Rejected: 'bg-red-100 text-red-700',
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', priority: '', page: 1 });
    const [total, setTotal] = useState(0);
    const [slaAlert, setSlaAlert] = useState({ breached: 0, nearDeadline: 0 });
    const [assignModal, setAssignModal] = useState(null);
    const [assignForm, setAssignForm] = useState({ staffId: '', staffName: '', expectedCompletionDate: '' });

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
            const { data } = await getAllComplaints(params);
            setComplaints(data.data);
            setTotal(data.total);
        } catch {
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const fetchSLA = async () => {
        try {
            const { data } = await getSLABreached();
            setSlaAlert({ breached: data.breached.count, nearDeadline: data.nearDeadline.count });
        } catch {}
    };

    useEffect(() => { fetchComplaints(); }, [filters]);
    useEffect(() => { fetchSLA(); }, []);

    const handleAssign = async () => {
        try {
            await assignComplaint(assignModal, assignForm);
            toast.success('Complaint assigned!');
            setAssignModal(null);
            setAssignForm({ staffId: '', staffName: '', expectedCompletionDate: '' });
            fetchComplaints();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Assignment failed');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Reason for rejection:');
        if (reason === null) return;
        try {
            await rejectComplaint(id, { reason });
            toast.success('Complaint rejected');
            fetchComplaints();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>

            {/* SLA Alerts */}
            {(slaAlert.breached > 0 || slaAlert.nearDeadline > 0) && (
                <div className="flex gap-3 mb-5">
                    {slaAlert.breached > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
                            🔴 <strong>{slaAlert.breached}</strong> SLA Breached
                        </div>
                    )}
                    {slaAlert.nearDeadline > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-700">
                            🟡 <strong>{slaAlert.nearDeadline}</strong> Near Deadline
                        </div>
                    )}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}
                    className="border rounded-lg px-3 py-1.5 text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Status'}</option>)}
                </select>
                <select value={filters.priority} onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value, page: 1 }))}
                    className="border rounded-lg px-3 py-1.5 text-sm">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p || 'All Priority'}</option>)}
                </select>
                <button onClick={() => navigate('/admin/reports')}
                    className="ml-auto bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition">
                    📊 View Reports
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="text-left px-4 py-3">Complaint ID</th>
                            <th className="text-left px-4 py-3">Student</th>
                            <th className="text-left px-4 py-3">Category</th>
                            <th className="text-left px-4 py-3">Priority</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">SLA</th>
                            <th className="text-left px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : complaints.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-8 text-gray-400">No complaints found</td></tr>
                        ) : complaints.map((c) => (
                            <tr key={c._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.complaintId}</td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800">{c.student.name}</p>
                                    <p className="text-xs text-gray-400">{c.student.roomNumber} · {c.student.hostelBlock}</p>
                                </td>
                                <td className="px-4 py-3 text-gray-700">{c.category}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs font-semibold ${c.priority === 'High' ? 'text-red-600' : c.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                        {c.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[c.status]}`}>{c.status}</span>
                                </td>
                                <td className="px-4 py-3 text-xs">
                                    {c.sla?.isBreached ? <span className="text-red-500">🔴 Breached</span>
                                        : c.sla?.isNearDeadline ? <span className="text-yellow-500">🟡 Near</span>
                                        : <span className="text-green-500">✅ OK</span>}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => navigate(`/complaint/${c.complaintId}`)}
                                            className="text-blue-600 hover:underline text-xs">View</button>
                                        {c.status === 'Pending' && (
                                            <>
                                                <button onClick={() => setAssignModal(c.complaintId)}
                                                    className="text-green-600 hover:underline text-xs">Assign</button>
                                                <button onClick={() => handleReject(c.complaintId)}
                                                    className="text-red-600 hover:underline text-xs">Reject</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <p>Total: {total} complaints</p>
                <div className="flex gap-2">
                    <button disabled={filters.page <= 1} onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                        className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
                    <span className="px-3 py-1">Page {filters.page}</span>
                    <button disabled={complaints.length < 20} onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                        className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
                </div>
            </div>

            {/* Assign Modal */}
            {assignModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="font-bold text-gray-800 mb-4">Assign Complaint</h2>
                        <div className="space-y-3">
                            <input placeholder="Staff ID" value={assignForm.staffId}
                                onChange={(e) => setAssignForm((p) => ({ ...p, staffId: e.target.value }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <input placeholder="Staff Name" value={assignForm.staffName}
                                onChange={(e) => setAssignForm((p) => ({ ...p, staffName: e.target.value }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <input type="datetime-local" value={assignForm.expectedCompletionDate}
                                onChange={(e) => setAssignForm((p) => ({ ...p, expectedCompletionDate: e.target.value }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setAssignModal(null)} className="flex-1 border rounded-lg py-2 text-sm">Cancel</button>
                            <button onClick={handleAssign} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700">Assign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;