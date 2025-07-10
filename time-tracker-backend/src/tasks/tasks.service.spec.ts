/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './entities/task.entity';

describe('TasksService', () => {
  let taskService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('should create a task', () => {
    const task = taskService.create({
      title: 'Test Task',
      description: 'Test Description',
    } as unknown as CreateTaskDto);
    expect(task).toBeDefined();
    expect(task).toEqual({
      id: expect.any(Number),
      title: 'Test Task',
      description: 'Test Description',
      createdAt: expect.any(Date),
      status: TaskStatus.PENDING,
    });
  });

  it('should return all tasks', () => {
    // Create some tasks first
    taskService.create({
      title: 'Test Task',
      description: 'Test Description',
    } as unknown as CreateTaskDto);

    taskService.create({
      title: 'Test Task 2',
      description: 'Test Description 2',
    } as unknown as CreateTaskDto);

    // Now test findAll
    const tasks = taskService.findAll();
    expect(tasks).toHaveLength(2);
    expect(tasks).toEqual([
      {
        id: expect.any(Number),
        title: 'Test Task',
        description: 'Test Description',
        createdAt: expect.any(Date),
        status: TaskStatus.PENDING,
      },
      {
        id: expect.any(Number),
        title: 'Test Task 2',
        description: 'Test Description 2',
        createdAt: expect.any(Date),
        status: TaskStatus.PENDING,
      },
    ]);
  });
});
