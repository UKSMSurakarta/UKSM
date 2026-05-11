import axiosInstance from './axios';

// Verification
export const getVerifikasiListApi = () => {
    return axiosInstance.get('/admin/verifikasi').then(res => res.data);
};

export const verifyLevelApi = (sekolahId, levelId, data) => {
    return axiosInstance.post(`/admin/verifikasi/${sekolahId}/level/${levelId}`, data).then(res => res.data);
};

// Notifications
export const getNotificationsApi = (page = 1) => {
    return axiosInstance.get(`/notifications?page=${page}`).then(res => res.data);
};

export const getUnreadCountApi = () => {
    return axiosInstance.get('/notifications/unread-count').then(res => res.data);
};

export const markAsReadApi = (id) => {
    return axiosInstance.patch(`/notifications/${id}/read`).then(res => res.data);
};

export const markAllAsReadApi = () => {
    return axiosInstance.patch('/notifications/mark-all-read').then(res => res.data);
};
