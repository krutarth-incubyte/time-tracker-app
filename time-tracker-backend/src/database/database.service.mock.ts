/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TaskStatus } from '../tasks/entities/task.entity';

export class DatabaseMockService {
  private taskStore: Array<{
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
  }> = [];

  private nextId = 1;

  // Helper method to extract ID from eq condition
  private extractIdFromCondition(condition: any): number | null {
    try {
      // Parse Drizzle SQL condition object
      if (
        condition &&
        typeof condition === 'object' &&
        'queryChunks' in condition
      ) {
        // Look for Param objects in queryChunks
        for (const chunk of condition.queryChunks) {
          if (
            chunk &&
            typeof chunk === 'object' &&
            'value' in chunk &&
            typeof chunk.value === 'number'
          ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return chunk.value;
          }
        }
      }

      // Fallback: Check if the condition has a right property (common in eq conditions)
      if (condition && typeof condition === 'object' && 'right' in condition) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return condition.right;
      }

      // Check if the condition has a value property
      if (condition && typeof condition === 'object' && 'value' in condition) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return condition.value;
      }
    } catch (e) {
      // Fallback to null
    }

    return null;
  }

  public db = {
    insert: () => ({
      values: (values: any) => ({
        returning: () => {
          const newTask = {
            id: this.nextId++,
            title: values.title,
            description: values.description || '',
            status: values.status || TaskStatus.PENDING,
            createdAt: new Date(),
          };
          this.taskStore.push(newTask);
          return Promise.resolve([newTask]);
        },
      }),
    }),

    select: () => ({
      from: () => {
        const promise = Promise.resolve([...this.taskStore]);

        (promise as any).where = (condition: any) => {
          const targetId = this.extractIdFromCondition(condition);
          if (targetId !== null) {
            const task = this.taskStore.find((t) => t.id === targetId);
            return Promise.resolve(task ? [task] : []);
          }
          return Promise.resolve(
            this.taskStore.length > 0 ? [this.taskStore[0]] : [],
          );
        };

        return promise;
      },
    }),

    update: () => ({
      set: (values: any) => ({
        where: (condition: any) => ({
          returning: () => {
            const targetId = this.extractIdFromCondition(condition);
            if (targetId !== null) {
              const taskIndex = this.taskStore.findIndex(
                (t) => t.id === targetId,
              );
              if (taskIndex !== -1) {
                const updated = {
                  ...this.taskStore[taskIndex],
                  ...values,
                };
                this.taskStore[taskIndex] = updated;
                return Promise.resolve([updated]);
              }
              return Promise.resolve([]); // Task not found
            }
            // Fallback: update first task if any exists
            if (this.taskStore.length > 0) {
              const updated = {
                ...this.taskStore[0],
                ...values,
              };
              this.taskStore[0] = updated;
              return Promise.resolve([updated]);
            }
            return Promise.resolve([]);
          },
        }),
      }),
    }),

    delete: () => ({
      where: (condition: any) => ({
        returning: () => {
          const targetId = this.extractIdFromCondition(condition);
          if (targetId !== null) {
            const taskIndex = this.taskStore.findIndex(
              (t) => t.id === targetId,
            );
            if (taskIndex !== -1) {
              const deleted = this.taskStore.splice(taskIndex, 1)[0];
              return Promise.resolve([deleted]);
            }
            return Promise.resolve([]); // Task not found
          }
          // Fallback: delete first task if any exists
          if (this.taskStore.length > 0) {
            const deleted = this.taskStore.shift();
            return Promise.resolve(deleted ? [deleted] : []);
          }
          return Promise.resolve([]);
        },
      }),
    }),
  };

  // Helper methods for test setup
  clearAllTasks() {
    this.taskStore = [];
    this.nextId = 1;
  }

  seedTask(task: {
    id?: number;
    title: string;
    description: string;
    status?: TaskStatus;
    createdAt?: Date;
  }) {
    const newTask = {
      id: task.id || this.nextId++,
      title: task.title,
      description: task.description,
      status: task.status || TaskStatus.PENDING,
      createdAt: task.createdAt || new Date(),
    };
    this.taskStore.push(newTask);
    if (task.id && task.id >= this.nextId) {
      this.nextId = task.id + 1;
    }
    return newTask;
  }

  getTaskStore() {
    return [...this.taskStore];
  }

  // For testing - manually set a task ID to simulate specific scenarios
  setTaskId(
    id: number,
    task: Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      createdAt: Date;
    }>,
  ) {
    const taskIndex = this.taskStore.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      this.taskStore[taskIndex] = { ...this.taskStore[taskIndex], ...task };
      return this.taskStore[taskIndex];
    }
    return null;
  }
}
