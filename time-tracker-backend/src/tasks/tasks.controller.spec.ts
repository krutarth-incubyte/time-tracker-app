import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', () => {
    // Given
    const createTaskDto = createMockTask(MOCK_TASKS.task1);
    const expectedTask = expectTaskStructure(MOCK_TASKS.task1);

    // When
    const task = controller.create(createTaskDto);

    // Then
    expect(task).toEqual(expectedTask);
  });

  it('should return all tasks', () => {
    // Given
    controller.create(createMockTask(MOCK_TASKS.task1));
    controller.create(createMockTask(MOCK_TASKS.task2));
    const expectedTasks = [
      expectTaskStructure(MOCK_TASKS.task1),
      expectTaskStructure(MOCK_TASKS.task2),
    ];

    // When
    const tasks = controller.findAll();

    // Then
    expect(tasks).toEqual(expectedTasks);
  });

  it('should return a task by id', () => {
    // Given
    const task = controller.create(createMockTask(MOCK_TASKS.task1));
    const expectedTask = expectTaskStructure(MOCK_TASKS.task1);

    // When
    const result = controller.findOne(task.id);

    // Then
    expect(result).toEqual(expectedTask);
  });

  it('should return user friendly error for a non-existent task', () => {
    // When
    const result = controller.findOne(999);

    // Then
    expect(result).toBe('Task not found');
  });

  it('should update a task', () => {
    // Given
    const task = controller.create(createMockTask(MOCK_TASKS.task1));
    const updateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
    };
    const expectedUpdatedTask = {
      ...MOCK_TASKS.task1,
      ...updateTaskDto,
    };

    // When
    const updatedTask = controller.update(task.id, updateTaskDto);
    const updatedFetchedTask = controller.findOne(task.id);

    // Then
    expect(updatedFetchedTask).toEqual(
      expectTaskStructure(expectedUpdatedTask),
    );
    expect(updatedTask).toEqual(expectTaskStructure(expectedUpdatedTask));
  });
});
