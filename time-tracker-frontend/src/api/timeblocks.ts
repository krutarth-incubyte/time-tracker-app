import { apiClient } from "./client";
import { Timeblock, AddTimeblockSchema } from "../types/timeblocks";

// Type for API response data before date conversion
type TimeblockResponse = Omit<Timeblock, "start" | "end" | "createdAt"> & {
  start: string;
  end: string;
  createdAt: string;
};

export const timeblocksApi = {
  // Get all timeblocks
  getTimeblocks: async (): Promise<Timeblock[]> => {
    const response = await apiClient.get<TimeblockResponse[]>("/timeblocks");
    return response.data.map((timeblock: TimeblockResponse) => ({
      ...timeblock,
      start: new Date(timeblock.start),
      end: new Date(timeblock.end),
      createdAt: new Date(timeblock.createdAt),
    }));
  },

  // Get timeblocks for a specific task
  getTimeblocksForTask: async (taskId: number): Promise<Timeblock[]> => {
    const response = await apiClient.get<TimeblockResponse[]>("/timeblocks");
    const allTimeblocks = response.data.map((timeblock: TimeblockResponse) => ({
      ...timeblock,
      start: new Date(timeblock.start),
      end: new Date(timeblock.end),
      createdAt: new Date(timeblock.createdAt),
    }));
    return allTimeblocks.filter(
      (timeblock: Timeblock) => timeblock.taskId === taskId
    );
  },

  // Get single timeblock
  getTimeblock: async (id: number): Promise<Timeblock> => {
    const response = await apiClient.get<Timeblock>(`/timeblocks/${id}`);
    return {
      ...response.data,
      start: new Date(response.data.start),
      end: new Date(response.data.end),
      createdAt: new Date(response.data.createdAt),
    };
  },

  // Create new timeblock
  createTimeblock: async (
    timeblockData: AddTimeblockSchema
  ): Promise<Timeblock> => {
    const response = await apiClient.post<Timeblock>(
      "/timeblocks",
      timeblockData
    );
    return {
      ...response.data,
      start: new Date(response.data.start),
      end: new Date(response.data.end),
      createdAt: new Date(response.data.createdAt),
    };
  },

  // Update timeblock
  updateTimeblock: async (
    id: number,
    timeblockData: Partial<AddTimeblockSchema>
  ): Promise<Timeblock> => {
    const response = await apiClient.patch<Timeblock>(
      `/timeblocks/${id}`,
      timeblockData
    );
    return {
      ...response.data,
      start: new Date(response.data.start),
      end: new Date(response.data.end),
      createdAt: new Date(response.data.createdAt),
    };
  },

  // Delete timeblock
  deleteTimeblock: async (id: number): Promise<void> => {
    await apiClient.delete(`/timeblocks/${id}`);
  },
};
