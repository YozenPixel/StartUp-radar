import { useQuery } from '@tanstack/react-query';
import { fetchStartups } from '@/lib/api';
import { FindStartupsParams } from '../types/startup';

export function useStartups(params: FindStartupsParams = {}) {
  return useQuery({
    queryKey: ['startups', params],
    queryFn: () => fetchStartups(params),
    staleTime: 1000 * 60 * 2, // 2 minutes de cache frais
  });
}
