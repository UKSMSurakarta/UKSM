import axiosInstance from './axios';

export const loginApi = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Terjadi kesalahan pada server.' };
    }
};

export const getMeApi = async () => {
    try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Sesi berakhir, silakan login kembali.' };
    }
};

export const logoutApi = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Terjadi kesalahan saat logout.' };
    }
};
