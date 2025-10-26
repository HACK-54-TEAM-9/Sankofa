import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { collectorAPI } from '../utils/api';

export function useCollectorDashboard() {
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
        const dashboardData = await collectorAPI.getDashboard(accessToken);
        setData(dashboardData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching collector dashboard:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const submitCollection = async (weight: number, location: string, photoUrl?: string) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const result = await collectorAPI.submitCollection(accessToken, {
        weight,
        location,
        photoUrl,
      });

      // Refresh dashboard data
      const dashboardData = await collectorAPI.getDashboard(accessToken);
      setData(dashboardData);

      return result;
    } catch (err: any) {
      console.error('Error submitting collection:', err);
      throw err;
    }
  };

  return { dashboardData: data, loading, error, submitCollection };
}
