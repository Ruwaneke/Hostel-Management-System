import { useEffect, useState } from 'react';
import { getReports } from '../services/api';
import toast from 'react-hot-toast';

const ReportsPage = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ startDate: '', endDate: '', hostelBlock: '' });

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
            const { data } = await getReports(params);
            setReports(data.data);
        } catch {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReports(); }, []);

    const StatCard = ({ title, value, sub, color = 'blue' }) => (
        <div className={`bg-${color}-50 border border-${color}-100 rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{title}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Maintenance Reports</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6 bg-white rounded-xl shadow p-4">
                <input type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-sm" />
                <input type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Hostel Block" value={filters.hostelBlock} onChange={(e) => setFilters((p) => ({ ...p, hostelBlock: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-sm" />
                <button onClick={fetchReports} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    Apply
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-400 py-10">Loading reports...</p>
            ) : reports && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard title="Total Complaints" value={reports.totalComplaints} color="blue" />
                        <StatCard title="SLA Breached" value={reports.sla.breached} color="red" />
                        <StatCard title="SLA Compliance" value={reports.sla.complianceRate} color="green" />
                        <StatCard title="Avg Resolution" value={`${reports.avgResolutionTimeHours}h`} sub="hours" color="purple" />
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Total Maintenance Cost</p>
                        <p className="text-3xl font-bold text-indigo-700">Rs. {reports.totalMaintenanceCost.toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* By Status */}
                        <div className="bg-white rounded-xl shadow p-4">
                            <h3 className="font-semibold text-gray-700 mb-3">By Status</h3>
                            {reports.byStatus.map((s) => (
                                <div key={s._id} className="flex justify-between text-sm py-1 border-b last:border-0">
                                    <span className="text-gray-600">{s._id}</span>
                                    <span className="font-medium">{s.count}</span>
                                </div>
                            ))}
                        </div>

                        {/* By Category */}
                        <div className="bg-white rounded-xl shadow p-4">
                            <h3 className="font-semibold text-gray-700 mb-3">Most Common Issues</h3>
                            {reports.byCategory.map((c) => (
                                <div key={c._id} className="flex justify-between text-sm py-1 border-b last:border-0">
                                    <span className="text-gray-600">{c._id}</span>
                                    <span className="font-medium">{c.count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Feedback */}
                        <div className="bg-white rounded-xl shadow p-4">
                            <h3 className="font-semibold text-gray-700 mb-3">Feedback Summary</h3>
                            {reports.feedbackStats.length === 0 ? (
                                <p className="text-sm text-gray-400">No feedback yet</p>
                            ) : reports.feedbackStats.map((f) => (
                                <div key={f._id} className="flex justify-between text-sm py-1 border-b last:border-0">
                                    <span className="text-gray-600 capitalize">{f._id.replace('_', ' ')}</span>
                                    <span className="font-medium">{f.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;