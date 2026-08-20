import { useQuery } from '@tanstack/react-query';
import { fetchMetrics } from '@/lib/api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
