import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { DatabaseService } from '../database/database.service';
import { tasks } from '../database/schemas/tasks.schema';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const [task] = await this.databaseService.db
      .insert(tasks)
      .values({
        title: createTaskDto.title,
        description: createTaskDto.description,
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
}
