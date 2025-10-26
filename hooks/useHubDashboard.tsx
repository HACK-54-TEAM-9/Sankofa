import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { hubAPI } from '../utils/api';

export function useHubDashboard() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const dashboardData = await hubAPI.getDashboard(accessToken);
        setData(dashboardData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching hub dashboard:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const getPendingCollections = async () => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const result = await hubAPI.getPendingCollections(accessToken);
      return result.collections || [];
    } catch (err: any) {
      console.error('Error fetching pending collections:', err);
      throw err;
    }
  };

  return { dashboardData: data, loading, error, getPendingCollections };
}
