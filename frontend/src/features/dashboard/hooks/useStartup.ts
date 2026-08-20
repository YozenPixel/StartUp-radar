import { useQuery } from '@tanstack/react-query';
import { fetchStartupById } from '@/lib/api';

export function useStartup(id?: string) {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: () => fetchStartupById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
