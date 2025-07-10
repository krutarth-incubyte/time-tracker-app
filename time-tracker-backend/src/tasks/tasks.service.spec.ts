/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', () => {
    const task = service.create({
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
});
