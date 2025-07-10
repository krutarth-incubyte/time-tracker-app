import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  create(createTaskDto: CreateTaskDto) {
    const task: Task = {
      id: this.tasks.length + 1,
      ...createTaskDto,
      createdAt: new Date(),
      status: TaskStatus.PENDING,
    };
    this.tasks.push(task);
    return task;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      return 'Task not found';
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((task) => task.id === id);
    const updatedTask = { ...task, ...updateTaskDto };
    this.tasks = this.tasks.map((task) =>
      task.id === id ? updatedTask : task,
    );
    return updatedTask;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
