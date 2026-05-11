/**
 * Mengubah error validasi dari Laravel (422) menjadi object sederhana { field: message }
 * @param {Object} error 
 * @returns {Object}
 */
export const parseValidationErrors = (error) => {
    if (error?.response?.status === 422) {
        const errors = error.response.data.errors;
        const parsed = {};
        Object.keys(errors).forEach((key) => {
            parsed[key] = errors[key][0]; // Ambil pesan pertama untuk setiap field
        });
        return parsed;
    }
    return {};
};

/**
 * Mendapatkan pesan error yang ramah pengguna dalam Bahasa Indonesia
 * @param {Object} error 
 * @returns {string}
 */
export const getErrorMessage = (error) => {
    if (!error.response) {
        return "Gagal terhubung ke server. Periksa koneksi internet Anda.";
    }

    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
        case 400:
            return data.message || "Permintaan tidak valid.";
        case 401:
            return "Sesi Anda telah berakhir. Silakan login kembali.";
        case 403:
            return "Anda tidak memiliki akses untuk melakukan tindakan ini.";
        case 404:
            return data.message || "Data tidak ditemukan.";
        case 422:
            return data.message || "Data yang dikirim tidak valid.";
        case 500:
            return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
        default:
            return data.message || "Terjadi kesalahan yang tidak diketahui.";
    }
};
