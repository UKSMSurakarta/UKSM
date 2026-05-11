import axiosInstance from './axios';

// Users
export const getUsersApi = (params) => axiosInstance.get('/superadmin/users', { params }).then(res => res.data);
export const createUserApi = (data) => axiosInstance.post('/superadmin/users', data).then(res => res.data);
export const updateUserApi = (id, data) => axiosInstance.put(`/superadmin/users/${id}`, data).then(res => res.data);
export const deleteUserApi = (id) => axiosInstance.delete(`/superadmin/users/${id}`).then(res => res.data);
export const toggleUserActiveApi = (id) => axiosInstance.patch(`/superadmin/users/${id}/toggle-active`).then(res => res.data);
export const resetUserPasswordApi = (id) => axiosInstance.post(`/superadmin/users/${id}/reset-password`).then(res => res.data);

// Sekolah
export const getSekolahsApi = (params) => axiosInstance.get('/superadmin/sekolahs', { params }).then(res => res.data);
export const createSekolahApi = (data) => axiosInstance.post('/superadmin/sekolahs', data).then(res => res.data);
export const updateSekolahApi = (id, data) => axiosInstance.put(`/superadmin/sekolahs/${id}`, data).then(res => res.data);
export const deleteSekolahApi = (id) => axiosInstance.delete(`/superadmin/sekolahs/${id}`).then(res => res.data);

// OPD
export const getOpdsApi = (params) => axiosInstance.get('/superadmin/opds', { params }).then(res => res.data);
export const createOpdApi = (data) => axiosInstance.post('/superadmin/opds', data).then(res => res.data);
export const updateOpdApi = (id, data) => axiosInstance.put(`/superadmin/opds/${id}`, data).then(res => res.data);
export const deleteOpdApi = (id) => axiosInstance.delete(`/superadmin/opds/${id}`).then(res => res.data);
