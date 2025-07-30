import { Injectable, BadRequestException } from '@nestjs/common';
import { eq, isNull } from 'drizzle-orm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { DatabaseService } from '../database/database.service';
import { tasks } from '../database/schemas/tasks.schema';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Validate parent task exists if parentTaskId is provided
    if (createTaskDto.parentTaskId) {
      const parentTask = await this.findOne(createTaskDto.parentTaskId);
      if (typeof parentTask === 'string') {
        throw new BadRequestException('Parent task not found');
      }
    }

    const [task] = await this.databaseService.db
      .insert(tasks)
      .values({
        title: createTaskDto.title,
        description: createTaskDto.description,
        parentTaskId: createTaskDto.parentTaskId,
      })
      .returning();

    return task as Task;
  }

  async findAll(): Promise<Task[]> {
    const allTasks = await this.databaseService.db.select().from(tasks);

    return allTasks as Task[];
  }

  async findOne(id: number): Promise<Task | string> {
    const [task] = await this.databaseService.db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id));

    if (!task) {
      return 'Task not found';
    }

    return task as Task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | string> {
    // Validate parent task exists if parentTaskId is being updated
    if (updateTaskDto.parentTaskId !== undefined) {
      if (updateTaskDto.parentTaskId === id) {
        throw new BadRequestException('Task cannot be its own parent');
      }

      if (updateTaskDto.parentTaskId) {
        const parentTask = await this.findOne(updateTaskDto.parentTaskId);
        if (typeof parentTask === 'string') {
          throw new BadRequestException('Parent task not found');
        }

        // Check for circular dependency
        const wouldCreateCircular = await this.wouldCreateCircularDependency(
          id,
          updateTaskDto.parentTaskId,
        );
        if (wouldCreateCircular) {
          throw new BadRequestException(
            'This would create a circular dependency',
          );
        }
      }
    }

    const [updatedTask] = await this.databaseService.db
      .update(tasks)
      .set({ ...updateTaskDto })
      .where(eq(tasks.id, id))
      .returning();

    if (!updatedTask) {
      return 'Task not found';
    }

    return updatedTask as Task;
  }

  async remove(id: number): Promise<string> {
    const [deletedTask] = await this.databaseService.db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    if (!deletedTask) {
      return 'Task not found';
    }

    return 'Task removed';
  }

  // Get all sub-tasks for a parent task
  async getSubTasks(parentTaskId: number): Promise<Task[]> {
    const subTasks = await this.databaseService.db
      .select()
      .from(tasks)
      .where(eq(tasks.parentTaskId, parentTaskId));

    return subTasks as Task[];
  }

  // Get all top-level tasks (tasks without a parent)
  async getTopLevelTasks(): Promise<Task[]> {
    const topLevelTasks = await this.databaseService.db
      .select()
      .from(tasks)
      .where(isNull(tasks.parentTaskId));

    return topLevelTasks as Task[];
  }

  // Check if setting a parent would create a circular dependency
  private async wouldCreateCircularDependency(
    taskId: number,
    potentialParentId: number,
  ): Promise<boolean> {
    // Start from the potential parent and traverse up the hierarchy
    let currentParentId = potentialParentId;

    while (currentParentId) {
      if (currentParentId === taskId) {
        return true; // Circular dependency found
      }

      const parentTask = await this.findOne(currentParentId);
      if (typeof parentTask === 'string') {
        break; // Parent not found, break the loop
      }

      currentParentId = parentTask.parentTaskId ?? 0;
    }

    return false;
  }
}
