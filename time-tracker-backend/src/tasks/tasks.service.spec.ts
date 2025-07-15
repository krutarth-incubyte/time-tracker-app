/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { DatabaseService } from '../database/database.service';
import { DatabaseMockService } from '../database/database.service.mock';

describe('TasksService', () => {
  let taskService: TasksService;
  let mockDatabaseService: DatabaseMockService;

  // Test data constants
  const MOCK_TASKS = {
    task1: { title: 'Test Task', description: 'Test Description' },
    task2: { title: 'Test Task 2', description: 'Test Description 2' },
  } as const;

  // Helper functions
  const createMockTask = (data: { title: string; description: string }) =>
    data as CreateTaskDto;

  const expectTaskStructure = (
    expectedTask: Omit<Task, 'id' | 'createdAt' | 'status'>,
  ) => ({
    id: expect.any(Number),
    title: expectedTask.title,
    description: expectedTask.description,
    createdAt: expect.any(Date),
    status: TaskStatus.PENDING,
  });

  beforeEach(async () => {
    mockDatabaseService = new DatabaseMockService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);

    // Clear the mock database before each test
    mockDatabaseService.clearAllTasks();
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('should create a task', async () => {
    // When
    const task = await taskService.create(createMockTask(MOCK_TASKS.task1));

    // Then
    expect(task).toBeDefined();
    expect(task).toEqual(expectTaskStructure(MOCK_TASKS.task1));
  });

  it('should return all tasks', async () => {
    // Given
    await taskService.create(createMockTask(MOCK_TASKS.task1));
    await taskService.create(createMockTask(MOCK_TASKS.task2));

    // When
    const tasks = await taskService.findAll();

    // Then
    expect(tasks).toHaveLength(2);
    expect(tasks).toEqual([
      expectTaskStructure(MOCK_TASKS.task1),
      expectTaskStructure(MOCK_TASKS.task2),
    ]);
  });

  it('should return a task by id', async () => {
    // Given
    const task = await taskService.create(createMockTask(MOCK_TASKS.task1));

    // When
    const result = await taskService.findOne(task.id);

    // Then
    expect(result).toEqual(expectTaskStructure(MOCK_TASKS.task1));
  });

  it('should return user friendly error for a non-existent task', async () => {
    // When
    const result = await taskService.findOne(999);

    // Then
    expect(result).toBe('Task not found');
  });

  it('should update a task', async () => {
    // Given
    const task = await taskService.create(createMockTask(MOCK_TASKS.task1));
    const taskUpdate = {
      title: 'Updated Task',
      description: 'Updated Description',
    };
    const expectedUpdatedTask = {
      ...MOCK_TASKS.task1,
      ...taskUpdate,
    };

    // When
    const updatedTask = await taskService.update(task.id, taskUpdate);
    const updatedFetchedTask = await taskService.findOne(task.id);

    // Then
    expect(updatedFetchedTask).toEqual(
      expectTaskStructure(expectedUpdatedTask),
    );
    expect(updatedTask).toEqual(expectTaskStructure(expectedUpdatedTask));
  });

  it('should return user friendly error for a non-existent task update', async () => {
    // Given
    const task = await taskService.create(createMockTask(MOCK_TASKS.task1));
    const taskUpdate = {
      title: 'Updated Task',
      description: 'Updated Description',
    };

    // When
    const updatedTask = await taskService.update(task.id + 4, taskUpdate);

    // Then
    expect(updatedTask).toBe('Task not found');
  });

  it('should delete a task', async () => {
    // Given
    const task = await taskService.create(createMockTask(MOCK_TASKS.task1));

    // When
    const fetchedTask = await taskService.findOne(task.id);
    const deletedTask = await taskService.remove(task.id);
    const deletedFetchedTask = await taskService.findOne(task.id);

    // Then
    expect(fetchedTask).toEqual(expectTaskStructure(MOCK_TASKS.task1));
    expect(deletedFetchedTask).toBe('Task not found');
    expect(deletedTask).toEqual('Task removed');
  });

  it('should return user friendly error for a non-existent task delete', async () => {
    // Given
    const task = await taskService.create(createMockTask(MOCK_TASKS.task1));

    // When
    const fetchedTask = await taskService.findOne(task.id);
    const deletedTask = await taskService.remove(task.id + 4);

    // Then
    expect(fetchedTask).toEqual(expectTaskStructure(MOCK_TASKS.task1));
    expect(deletedTask).toBe('Task not found');
  });

  // Additional tests for database-specific functionality
  it('should maintain data integrity across operations', async () => {
    // Given
    const task1 = await taskService.create(createMockTask(MOCK_TASKS.task1));
    const task2 = await taskService.create(createMockTask(MOCK_TASKS.task2));

    // When
    await taskService.remove(task1.id);
    const remainingTasks = await taskService.findAll();

    // Then
    expect(remainingTasks).toHaveLength(1);
    expect(remainingTasks[0]).toEqual(expectTaskStructure(MOCK_TASKS.task2));
    expect(remainingTasks[0].id).toBe(task2.id);
  });

  it('should handle empty database state', async () => {
    // When
    const tasks = await taskService.findAll();

    // Then
    expect(tasks).toHaveLength(0);
    expect(tasks).toEqual([]);
  });

  it('should generate unique IDs for tasks', async () => {
    // Given
    const task1 = await taskService.create(createMockTask(MOCK_TASKS.task1));
    const task2 = await taskService.create(createMockTask(MOCK_TASKS.task2));

    // Then
    expect(task1.id).not.toEqual(task2.id);
    expect(task1.id).toBeGreaterThan(0);
    expect(task2.id).toBeGreaterThan(0);
    expect(task2.id).toBeGreaterThan(task1.id);
  });
});
