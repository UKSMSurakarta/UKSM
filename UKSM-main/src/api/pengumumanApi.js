import axiosInstance from './axios';

const getBaseUrl = (role) => role === 'superadmin' ? '/superadmin' : '/admin';

/**
 * Ambil daftar pengumuman
 */
export const getPengumumansApi = (role) =>
    axiosInstance.get(`${getBaseUrl(role)}/pengumumans`);

/**
 * Buat pengumuman baru (broadcast notifikasi ke sekolah)
 * payload: { judul, isi, target_type?, opd_id? }
 */
export const createPengumumanApi = (role, payload) =>
    axiosInstance.post(`${getBaseUrl(role)}/pengumumans`, payload);

/**
 * Update pengumuman
 */
export const updatePengumumanApi = (role, id, payload) =>
    axiosInstance.put(`${getBaseUrl(role)}/pengumumans/${id}`, payload);

/**
 * Hapus pengumuman
 */
export const deletePengumumanApi = (role, id) =>
    axiosInstance.delete(`${getBaseUrl(role)}/pengumumans/${id}`);

/**
 * Ambil daftar OPD (hanya superadmin, untuk dropdown target)
 */
export const getOpdListApi = () =>
    axiosInstance.get('/superadmin/pengumumans-opd-list');
