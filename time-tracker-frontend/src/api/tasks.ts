import { apiClient } from "./client";
import { Task, AddTaskSchema } from "../types/tasks";

// Type for API response data before date conversion
type TaskResponse = Omit<Task, "createdAt"> & {
  createdAt: string;
};

export const tasksApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<TaskResponse[]>("/tasks");
    return response.data.map((task: TaskResponse) => ({
      ...task,
      createdAt: new Date(task.createdAt),
    }));
  },

  // Get single task
  getTask: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  },

  // Create new task
  createTask: async (taskData: AddTaskSchema): Promise<Task> => {
    const response = await apiClient.post<Task>("/tasks", {
      title: taskData.title,
      description: taskData.description,
    });
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  },

  // Update task
  updateTask: async (
    id: number,
    taskData: Partial<AddTaskSchema>
  ): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, {
      title: taskData.title,
      description: taskData.description,
    });
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  },

  // Delete task
  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
