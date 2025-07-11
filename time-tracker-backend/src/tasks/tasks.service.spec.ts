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

  it('should return a task by id', () => {
    // Given
    const task = taskService.create(createMockTask(MOCK_TASKS.task1));

    // When
    const result = taskService.findOne(task.id);

    // Then
    expect(result).toEqual(expectTaskStructure(MOCK_TASKS.task1));
  });

  it('should return user friendly error for a non-existent task', () => {
    // When
    const result = taskService.findOne(999);

    // Then
    expect(result).toBe('Task not found');
  });

  it('should update a task', () => {
    // Given
    const task = taskService.create(createMockTask(MOCK_TASKS.task1));
    const taskUpdate = {
      title: 'Updated Task',
      description: 'Updated Description',
    };
    const expectedUpdatedTask = {
      ...MOCK_TASKS.task1,
      ...taskUpdate,
    };

    // When
    const updatedTask = taskService.update(task.id, taskUpdate);
    const updatedFetchedTask = taskService.findOne(task.id);

    // Then
    expect(updatedFetchedTask).toEqual(
      expectTaskStructure(expectedUpdatedTask),
    );
    expect(updatedTask).toEqual(expectTaskStructure(expectedUpdatedTask));
  });

  it('should return user friendly error for a non-existent task update', () => {
    // Given
    const task = taskService.create(createMockTask(MOCK_TASKS.task1));
    const taskUpdate = {
      title: 'Updated Task',
      description: 'Updated Description',
    };

    // When
    const updatedTask = taskService.update(task.id + 4, taskUpdate);

    // Then
    expect(updatedTask).toBe('Task not found');
  });

  it('should delete a task', () => {
    // Given
    const task = taskService.create(createMockTask(MOCK_TASKS.task1));

    // When
    const fetchedTask = taskService.findOne(task.id);
    const deletedTask = taskService.remove(task.id);
    const deletedFetchedTask = taskService.findOne(task.id);

    // Then
    expect(fetchedTask).toEqual(expectTaskStructure(MOCK_TASKS.task1));
    expect(deletedFetchedTask).toBe('Task not found');
    expect(deletedTask).toEqual('Task removed');
  });

  it('should return user friendly error for a non-existent task delete', () => {
    // Given
    const task = taskService.create(createMockTask(MOCK_TASKS.task1));

    // When
    const fetchedTask = taskService.findOne(task.id);
    const deletedTask = taskService.remove(task.id + 4);

    // Then
    expect(fetchedTask).toEqual(expectTaskStructure(MOCK_TASKS.task1));
    expect(deletedTask).toBe('Task not found');
  });
});
