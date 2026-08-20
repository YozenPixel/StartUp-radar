import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createStartup,
  updateStartup,
  deleteStartup,
  createFundingRound,
} from '@/lib/api';

export function useCreateStartupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStartup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useUpdateStartupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateStartup>[1];
    }) => updateStartup(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      queryClient.invalidateQueries({ queryKey: ['startup', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useDeleteStartupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStartup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useCreateFundingRoundMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFundingRound,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      queryClient.invalidateQueries({
        queryKey: ['startup', variables.startupId],
      });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
