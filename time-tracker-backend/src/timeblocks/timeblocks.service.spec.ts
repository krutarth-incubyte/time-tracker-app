import { Test, TestingModule } from '@nestjs/testing';
import { TimeblocksService } from './timeblocks.service';
import { CreateTimeblockDto } from './dto/create-timeblock.dto';
import { Timeblock } from './entities/timeblock.entity';

export const createMockTimeblock = (timeblock: {
  taskId: number;
  start: Date;
  end: Date;
  description: string;
}): CreateTimeblockDto => timeblock as CreateTimeblockDto;

export const expectTimeblockStructure = (
  timeblock: Omit<Timeblock, 'id' | 'createdAt'>,
): Partial<Timeblock> => ({
  id: expect.any(Number) as number,
  taskId: timeblock.taskId,
  start: timeblock.start,
  end: timeblock.end,
  description: timeblock.description,
  createdAt: expect.any(Date) as Date,
});

export const MOCK_TIMEBLOCKS = {
  timeblock1: {
    taskId: 1,
    start: new Date(),
    end: new Date(),
    description: 'Timeblock 1',
  },
  timeblock2: {
    taskId: 2,
    start: new Date(),
    end: new Date(),
    description: 'Timeblock 2',
  },
};
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
    const timeblock: CreateTimeblockDto = createMockTimeblock(
      MOCK_TIMEBLOCKS.timeblock1,
    );
    // When
    const createdTimeblock = service.create(timeblock);
    // Then
    expect(createdTimeblock).toEqual(
      expectTimeblockStructure(MOCK_TIMEBLOCKS.timeblock1),
    );
  });

  it('should return all timeblocks', () => {
    // Given
    service.create(createMockTimeblock(MOCK_TIMEBLOCKS.timeblock1));
    service.create(createMockTimeblock(MOCK_TIMEBLOCKS.timeblock2));
    // When
    const result = service.findAll();
    // Then
    expect(result).toEqual([
      expectTimeblockStructure(MOCK_TIMEBLOCKS.timeblock1),
      expectTimeblockStructure(MOCK_TIMEBLOCKS.timeblock2),
    ]);
  });

  it('should return an empty array if no timeblocks are created', () => {
    // When
    const result = service.findAll();
    expect(result).toEqual([]);
  });

  it('should return a timeblock by id', () => {
    // Given
    const timeblock = service.create(
      createMockTimeblock(MOCK_TIMEBLOCKS.timeblock1),
    );
    // When
    const result = service.findOne(timeblock.id);
    // Then
    expect(result).toEqual(
      expectTimeblockStructure(MOCK_TIMEBLOCKS.timeblock1),
    );
  });

  it('should return a user friendly error if the timeblock is not found', () => {
    // When
    const result = service.findOne(999);
    // Then
    expect(result).toBe('Timeblock not found');
  });

  it('should update a timeblock', () => {
    // Given
    const timeblock = service.create(
      createMockTimeblock(MOCK_TIMEBLOCKS.timeblock1),
    );
    const updatedTimeblock = {
      ...MOCK_TIMEBLOCKS.timeblock1,
      description: 'Updated Timeblock',
    };
    // When
    const updatedTimeblockResult = service.update(
      timeblock.id,
      updatedTimeblock,
    );
    const fetchedTimeblock = service.findOne(timeblock.id);
    // Then
    expect(fetchedTimeblock).toEqual(
      expectTimeblockStructure(updatedTimeblock),
    );
    expect(updatedTimeblockResult).toEqual(
      expectTimeblockStructure(updatedTimeblock),
    );
  });

  it('should return a user friendly error if the timeblock is not found', () => {
    // When
    const result = service.update(999, {
      description: 'Updated Timeblock',
    });
    // Then
    expect(result).toBe('Timeblock not found');
  });

  it('should delete a timeblock', () => {
    // Given
    const timeblock = service.create(
      createMockTimeblock(MOCK_TIMEBLOCKS.timeblock1),
    );
    // When
    const fetchedTimeblock = service.findOne(timeblock.id);
    const result = service.remove(timeblock.id);
    const fetchedTimeblockAfterDelete = service.findOne(timeblock.id);
    // Then
    expect(fetchedTimeblock).toEqual(expectTimeblockStructure(timeblock));
    expect(fetchedTimeblockAfterDelete).toBe('Timeblock not found');
    expect(result).toBe('Timeblock deleted');
  });
});
