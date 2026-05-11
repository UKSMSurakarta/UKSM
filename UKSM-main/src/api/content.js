import axiosInstance from './axios';

export const getKontensApi = (tipe, page = 1, status = '') => {
    return axiosInstance.get(`/user/kontens`, {
        params: { tipe, page, is_published: status }
    }).then(res => res.data);
};

export const getKontenDetailApi = (id) => {
    return axiosInstance.get(`/user/kontens/${id}`).then(res => res.data);
};

export const createKontenApi = (formData) => {
    return axiosInstance.post(`/user/kontens`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
};

export const updateKontenApi = (id, formData) => {
    // Laravel PUT workaround for multipart/form-data
    formData.append('_method', 'PUT');
    return axiosInstance.post(`/user/kontens/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
};

export const deleteKontenApi = (id) => {
    return axiosInstance.delete(`/user/kontens/${id}`).then(res => res.data);
};

export const togglePublishApi = (id) => {
    return axiosInstance.patch(`/user/kontens/${id}/publish`).then(res => res.data);
};
