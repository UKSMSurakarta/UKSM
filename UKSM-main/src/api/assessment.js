import axiosInstance from './axios';

export const getLevelsApi = async () => {
    try {
        const response = await axiosInstance.get('/sekolah/levels');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Terjadi kesalahan saat mengambil data level.' };
    }
};

export const getQuestionsApi = async (levelId) => {
    try {
        const response = await axiosInstance.get(`/sekolah/levels/${levelId}/pertanyaans`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Terjadi kesalahan saat mengambil data pertanyaan.' };
    }
};

export const saveAnswersApi = async (levelId, jawabans) => {
    try {
        const response = await axiosInstance.post(`/sekolah/levels/${levelId}/jawab`, { jawabans });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Gagal menyimpan jawaban.' };
    }
};

export const submitFinalApi = async (levelId) => {
    try {
        const response = await axiosInstance.post(`/sekolah/levels/${levelId}/submit-final`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Gagal melakukan submit final.' };
    }
};

export const uploadBuktiApi = async (formData) => {
    try {
        const response = await axiosInstance.post('/sekolah/upload-bukti', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Gagal mengunggah berkas.' };
    }
};

export const getProfileApi = async () => {
    try {
        const response = await axiosInstance.get('/sekolah/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Gagal mengambil data profil.' };
    }
};

export const updateProfileApi = async (data) => {
    try {
        const response = await axiosInstance.put('/sekolah/profile', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Gagal memperbarui profil.' };
    }
};
