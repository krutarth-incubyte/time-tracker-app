import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks";
import { UpdateTaskSchema } from "../types/tasks";

const QUERY_KEYS = {
  tasks: ["tasks"] as const,
  task: (id: number) => ["tasks", id] as const,
  subTasks: (parentId: number) => ["tasks", "subtasks", parentId] as const,
  topLevelTasks: ["tasks", "top-level"] as const,
};

// Get all tasks
export const useTasks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tasks,
    queryFn: tasksApi.getTasks,
  });
};

// Get single task
export const useGetTask = (id: number) => {
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
    onSuccess: (newTask) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.topLevelTasks });
      // If it's a sub-task, invalidate the parent's sub-tasks
      if (newTask.parentTaskId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.subTasks(newTask.parentTaskId),
        });
      }
    },
  });
};

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskSchema }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (updatedTask, { id }) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.topLevelTasks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.task(id) });

      // If parentTaskId was updated, invalidate sub-tasks for both old and new parents
      if (updatedTask.parentTaskId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.subTasks(updatedTask.parentTaskId),
        });
      }
      // Also invalidate all sub-tasks queries since we don't know the old parent
      queryClient.invalidateQueries({ queryKey: ["tasks", "subtasks"] });
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.topLevelTasks });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.task(id) });
      // Invalidate sub-tasks queries since deleting a parent affects sub-tasks
      queryClient.invalidateQueries({ queryKey: ["tasks", "subtasks"] });
    },
  });
};

// Get sub-tasks for a parent task
export const useSubTasks = (parentTaskId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.subTasks(parentTaskId),
    queryFn: () => tasksApi.getSubTasks(parentTaskId),
    enabled: !!parentTaskId,
  });
};

// Get top-level tasks
export const useTopLevelTasks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.topLevelTasks,
    queryFn: tasksApi.getTopLevelTasks,
  });
};
