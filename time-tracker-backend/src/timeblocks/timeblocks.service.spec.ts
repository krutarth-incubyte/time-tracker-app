import { Test, TestingModule } from '@nestjs/testing';
import { TimeblocksService } from './timeblocks.service';
import { CreateTimeblockDto } from './dto/create-timeblock.dto';

describe('TimeblocksService', () => {
  let service: TimeblocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeblocksService],
    }).compile();

    service = module.get<TimeblocksService>(TimeblocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a timeblock', () => {
    // Given
    const timeblock: CreateTimeblockDto = {
      taskId: 1,
      start: new Date(),
      end: new Date(),
      description: 'Timeblock 1',
    };
    // When
    const result = service.create(timeblock);
    // Then
    expect(result).toEqual({
      id: expect.any(Number),
      taskId: 1,
      start: new Date(),
      end: new Date(),
      description: 'Timeblock 1',
    });
  });
});
