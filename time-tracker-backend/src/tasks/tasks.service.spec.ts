/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from './entities/task.entity';

describe('TasksService', () => {
  let taskService: TasksService;

  // Test data constants
  const MOCK_TASKS = {
    task1: { title: 'Test Task', description: 'Test Description' },
    task2: { title: 'Test Task 2', description: 'Test Description 2' },
  } as const;

  // Helper functions
  const createMockTask = (data: { title: string; description: string }) =>
    data as CreateTaskDto;

  const expectTaskStructure = (expectedTask: Partial<Task>) => ({
    id: expect.any(Number),
    title: expectedTask.title,
    description: expectedTask.description,
    createdAt: expect.any(Date),
    status: TaskStatus.PENDING,
  });

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
    // When
    const task = taskService.create(createMockTask(MOCK_TASKS.task1));

    // Then
    expect(task).toBeDefined();
    expect(task).toEqual(expectTaskStructure(MOCK_TASKS.task1));
  });

  it('should return all tasks', () => {
    // Given
    taskService.create(createMockTask(MOCK_TASKS.task1));
    taskService.create(createMockTask(MOCK_TASKS.task2));

    // When
    const tasks = taskService.findAll();

    // Then
    expect(tasks).toHaveLength(2);
    expect(tasks).toEqual([
      expectTaskStructure(MOCK_TASKS.task1),
      expectTaskStructure(MOCK_TASKS.task2),
    ]);
  });
});
