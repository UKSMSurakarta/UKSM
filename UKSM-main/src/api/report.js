import axiosInstance from './axios';

export const getRekapSekolahApi = (params) => {
    return axiosInstance.get('/admin/laporan/rekap-sekolah', { params }).then(res => res.data);
};

export const getRekapLevelApi = (params) => {
    return axiosInstance.get('/admin/laporan/rekap-level', { params }).then(res => res.data);
};

export const getDetailSekolahApi = (sekolahId, params) => {
    return axiosInstance.get(`/admin/laporan/detail-sekolah/${sekolahId}`, { params }).then(res => res.data);
};

export const getStatistikPeriodeApi = (periodId) => {
    return axiosInstance.get(`/admin/laporan/statistik-periode/${periodId}`).then(res => res.data);
};

export const exportLaporanApi = (params) => {
    return axiosInstance.get('/admin/laporan/export', { 
        params, 
        responseType: 'blob' 
    });
};
