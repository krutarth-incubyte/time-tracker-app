import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { DatabaseService } from '../database/database.service';
import { DatabaseMockService } from '../database/database.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;
  let mockDatabaseService: DatabaseMockService;

  const MOCK_TASKS = {
    task1: { title: 'Test Task', description: 'Test Description' },
    task2: { title: 'Test Task 2', description: 'Test Description 2' },
  } as const;

  // Helper functions
  const createMockTask = (data: { title: string; description: string }) =>
    data as CreateTaskDto;

  const expectTaskStructure = (expectedTask: Partial<Task>) => ({
    id: expect.any(Number) as number,
    title: expectedTask.title,
    description: expectedTask.description,
    createdAt: expect.any(Date) as Date,
    status: TaskStatus.PENDING,
  });

  beforeEach(async () => {
    mockDatabaseService = new DatabaseMockService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);

    // Clear the mock database before each test
    mockDatabaseService.clearAllTasks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    // Given
    const createTaskDto = createMockTask(MOCK_TASKS.task1);
    const expectedTask = expectTaskStructure(MOCK_TASKS.task1);

    // When
    const task = await controller.create(createTaskDto);

    // Then
    expect(task).toEqual(expectedTask);
  });

  it('should return all tasks', async () => {
    // Given
    await controller.create(createMockTask(MOCK_TASKS.task1));
    await controller.create(createMockTask(MOCK_TASKS.task2));
    const expectedTasks = [
      expectTaskStructure(MOCK_TASKS.task1),
      expectTaskStructure(MOCK_TASKS.task2),
    ];

    // When
    const tasks = await controller.findAll();

    // Then
    expect(tasks).toEqual(expectedTasks);
  });

  it('should return a task by id', async () => {
    // Given
    const task = await controller.create(createMockTask(MOCK_TASKS.task1));
    const expectedTask = expectTaskStructure(MOCK_TASKS.task1);

    // When
    const result = await controller.findOne(task.id);

    // Then
    expect(result).toEqual(expectedTask);
  });

  it('should throw NotFoundException for a non-existent task', async () => {
    // When & Then
    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a task', async () => {
    // Given
    const task = await controller.create(createMockTask(MOCK_TASKS.task1));
    const updateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
    };
    const expectedUpdatedTask = {
      ...MOCK_TASKS.task1,
      ...updateTaskDto,
    };

    // When
    const updatedTask = await controller.update(task.id, updateTaskDto);
    const updatedFetchedTask = await controller.findOne(task.id);

    // Then
    expect(updatedFetchedTask).toEqual(
      expectTaskStructure(expectedUpdatedTask),
    );

    expect(updatedTask).toEqual(expectTaskStructure(expectedUpdatedTask));
  });

  it('should throw NotFoundException when updating a non-existent task', async () => {
    // Given
    const updateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
    };

    // When & Then
    await expect(controller.update(999, updateTaskDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a task', async () => {
    // Given
    const task = await controller.create(createMockTask(MOCK_TASKS.task1));

    // When
    const result = await controller.remove(task.id);

    // Then
    expect(result).toEqual({ message: 'Task removed' });
    await expect(controller.findOne(task.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException when removing a non-existent task', async () => {
    // When & Then
    await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
  });
});
