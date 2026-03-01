import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('hms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        // Only redirect on 401 if NOT already on login page
        if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('hms_token');
            localStorage.removeItem('hms_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

// ── User Management ───────────────────────────────────────────────────────────
export const registerUser  = (data)   => api.post('/users/register', data);
export const loginUser     = (data)   => api.post('/users/login', data);
export const getAllUsers    = ()       => api.get('/users');
export const getUserById   = (userId) => api.get(`/users/${userId}`);
export const deleteUser    = (userId) => api.delete(`/users/${userId}`);

// ── Auth (Dev fallback) ───────────────────────────────────────────────────────
export const generateTestToken = (data) => api.post('/auth/generate-test-token', data);

// ── Complaints ────────────────────────────────────────────────────────────────
export const submitComplaint      = (data)    => api.post('/complaints', data);
export const getMyComplaints      = ()        => api.get('/complaints/my');
export const getComplaintById     = (id)      => api.get(`/complaints/${id}`);
export const submitFeedback       = (id, data)=> api.post(`/complaints/${id}/feedback`, data);
export const markNotificationsRead= (id)      => api.patch(`/complaints/${id}/notifications/read`);

// ── Admin / Staff ─────────────────────────────────────────────────────────────
export const getAllComplaints  = (params)    => api.get('/complaints', { params });
export const assignComplaint  = (id, data)  => api.patch(`/complaints/${id}/assign`, data);
export const rejectComplaint  = (id, data)  => api.patch(`/complaints/${id}/reject`, data);
export const updateProgress   = (id, data)  => api.patch(`/complaints/${id}/progress`, data);
export const completeComplaint= (id, data)  => api.patch(`/complaints/${id}/complete`, data);
export const getReports       = (params)    => api.get('/complaints/reports', { params });
export const getSLABreached   = ()          => api.get('/complaints/sla-breached');

export default api;