import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axios';
import { getErrorMessage } from '../utils/errorHelper';

/**
 * Custom hook untuk melakukan pemanggilan API (GET)
 * @param {string} url - Endpoint API
 * @param {Object} options - { immediate: boolean, params: object }
 * @returns {Object} { data, loading, error, refetch, setData }
 */
const useFetch = (url, options = { immediate: true, params: {} }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(options.immediate);
    const [error, setError] = useState(null);
    
    // Gunakan ref untuk melacak AbortController agar bisa di-cancel saat unmount atau fetch ulang
    const abortControllerRef = useRef(null);

    const fetchData = useCallback(async (customParams = null) => {
        // Cancel request sebelumnya jika masih berjalan
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(url, {
                params: customParams || options.params,
                signal: controller.signal
            });
            setData(response.data.data || response.data);
            setLoading(false);
        } catch (err) {
            if (err.name === 'AbortError') {
                // Jangan set error jika request di-cancel secara sengaja
                return;
            }
            const msg = getErrorMessage(err);
            setError(msg);
            setLoading(false);
        }
    }, [url, options.params]);

    useEffect(() => {
        if (options.immediate) {
            fetchData();
        }

        // Cleanup: cancel request saat unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData, options.immediate]);

    return { 
        data, 
        loading, 
        error, 
        refetch: fetchData, 
        setData 
    };
};

export default useFetch;
