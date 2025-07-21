import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timeblocksApi } from "../api/timeblocks";
import { AddTimeblockSchema } from "../types/timeblocks";

const QUERY_KEYS = {
  timeblocks: ["timeblocks"] as const,
  timeblock: (id: number) => ["timeblocks", id] as const,
  timeblocksForTask: (taskId: number) =>
    ["timeblocks", "task", taskId] as const,
};

// Get all timeblocks
export const useTimeblocks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.timeblocks,
    queryFn: timeblocksApi.getTimeblocks,
  });
};

// Get timeblocks for a specific task
export const useTimeblocksForTask = (taskId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.timeblocksForTask(taskId),
    queryFn: () => timeblocksApi.getTimeblocksForTask(taskId),
    enabled: !!taskId,
  });
};

// Get single timeblock
export const useTimeblock = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.timeblock(id),
    queryFn: () => timeblocksApi.getTimeblock(id),
    enabled: !!id,
  });
};

// Create timeblock mutation
export const useCreateTimeblock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: timeblocksApi.createTimeblock,
    onSuccess: (newTimeblock) => {
      // Invalidate and refetch timeblocks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timeblocks });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.timeblocksForTask(newTimeblock.taskId),
      });
    },
  });
};

// Update timeblock mutation
export const useUpdateTimeblock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<AddTimeblockSchema>;
    }) => timeblocksApi.updateTimeblock(id, data),
    onSuccess: (updatedTimeblock, { id }) => {
      // Invalidate and refetch timeblocks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timeblocks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timeblock(id) });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.timeblocksForTask(updatedTimeblock.taskId),
      });
    },
  });
};

// Delete timeblock mutation
export const useDeleteTimeblock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: timeblocksApi.deleteTimeblock,
    onSuccess: (_, id) => {
      // Invalidate and refetch timeblocks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timeblocks });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.timeblock(id) });
      // Note: We don't know the taskId here, so we invalidate all task-specific queries
      queryClient.invalidateQueries({
        queryKey: ["timeblocks", "task"],
        type: "all",
      });
    },
  });
};
