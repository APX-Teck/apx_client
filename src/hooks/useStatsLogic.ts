import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { StatsOverview } from '@/app/types/analytics.types';

export function useStatsLogic() {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch portfolios to make the projects count dynamic
        const portfolios = await api.fetchPortfolios();
        const projectsCount = portfolios?.length || 0;
        
        // Base numbers for aesthetics, dynamically enhanced by actual portfolio count
        const baseClients = 25; 
        
        setStats({
          clientsServed: baseClients + Math.floor(projectsCount * 0.8), // Dynamic estimation
          projectsCompleted: projectsCount,
          satisfactionRate: 99,
          supportActive: '24/7'
        });
      } catch (err) {
        console.error('Failed to load stats', err);
        // Fallback stats if API fails
        setStats({
          clientsServed: 25,
          projectsCompleted: 0,
          satisfactionRate: 99,
          supportActive: '24/7'
        });
        setError('Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return { stats, isLoading, error };
}
