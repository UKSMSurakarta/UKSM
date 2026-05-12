import axiosInstance from './axios';

// Levels
export const getLevelsApi = () => axiosInstance.get('/admin/levels').then(res => res.data);
export const createLevelApi = (data) => axiosInstance.post('/admin/levels', data).then(res => res.data);
export const updateLevelApi = (id, data) => axiosInstance.put(`/admin/levels/${id}`, data).then(res => res.data);
export const deleteLevelApi = (id) => axiosInstance.delete(`/admin/levels/${id}`).then(res => res.data);
export const toggleLevelApi = (id) => axiosInstance.patch(`/admin/levels/${id}/toggle`).then(res => res.data);

// Questions (Pertanyaan)
export const getQuestionsByLevelApi = (levelId) => axiosInstance.get(`/admin/levels/${levelId}/pertanyaans`).then(res => res.data);
export const createQuestionApi = (levelId, data) => axiosInstance.post(`/admin/levels/${levelId}/pertanyaans`, data).then(res => res.data);
export const updateQuestionApi = (id, data) => axiosInstance.put(`/admin/pertanyaans/${id}`, data).then(res => res.data);
export const deleteQuestionApi = (id) => axiosInstance.delete(`/admin/pertanyaans/${id}`).then(res => res.data);
export const reorderQuestionsApi = (orders) => axiosInstance.post('/admin/pertanyaans/reorder', { orders }).then(res => res.data);
