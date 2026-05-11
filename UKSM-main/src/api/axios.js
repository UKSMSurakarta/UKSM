import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor for adding token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor for handling errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (!response) {
            // Network error (server mati atau tidak ada internet)
            toast.error("Periksa koneksi internet Anda atau hubungi admin.");
            return Promise.reject(error);
        }

        switch (response.status) {
            case 401:
                // Sesi habis atau tidak valid
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                toast.warning("Sesi Anda telah berakhir. Silakan login kembali.");
                // Gunakan timeout agar user sempat baca toast
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
                break;

            case 403:
                // Akses dilarang
                toast.error("Anda tidak memiliki akses ke halaman ini.");
                // Opsional: redirect ke forbidden page
                // window.location.href = '/unauthorized';
                break;

            case 422:
                // Error validasi (Laravel)
                // Biarkan komponen yang menangani parsing error via helper
                break;

            case 500:
                // Kesalahan server internal
                toast.error("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
                break;

            default:
                // Error lainnya
                if (response.data?.message) {
                    toast.error(response.data.message);
                }
                break;
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

