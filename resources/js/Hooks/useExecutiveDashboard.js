import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to manage fetching and recaching executive dashboard metrics.
 */
export default function useExecutiveDashboard(categories = [], transactions = []) {
    const [loading, setLoading] = useState(true);
    const [recaching, setRecaching] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchMetrics = async (force = false) => {
        if (force) setRecaching(true);
        else setLoading(true);
        setError(null);
        try {
            const url = force ? '/api/dashboard/metrics?force_recalculate=true' : '/api/dashboard/metrics';
            const response = await axios.get(url);
            setData(response.data.data || response.data);
        } catch (err) {
            console.error('Failed to fetch dashboard metrics:', err);
            setError('Gagal memuat data analitik dashboard. Silakan coba lagi.');
        } finally {
            setLoading(false);
            setRecaching(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, [transactions, categories]);

    return {
        data,
        loading,
        recaching,
        error,
        fetchMetrics
    };
}
