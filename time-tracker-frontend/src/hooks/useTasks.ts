import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks";
import { AddTaskSchema } from "../types/tasks";

const QUERY_KEYS = {
  tasks: ["tasks"] as const,
  task: (id: number) => ["tasks", id] as const,
};

// Get all tasks
export const useTasks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tasks,
    queryFn: tasksApi.getTasks,
  });
};

// Get single task
export const useTask = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.task(id),
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  });
};

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
};

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AddTaskSchema> }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.task(id) });
    },
  });
};

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: (_, id) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.task(id) });
    },
  });
};
