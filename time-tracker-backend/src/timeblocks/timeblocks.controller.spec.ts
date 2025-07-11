import { Test, TestingModule } from '@nestjs/testing';
import { TimeblocksController } from './timeblocks.controller';
import { TimeblocksService } from './timeblocks.service';
import {
  createMockTimeblock,
  expectTimeblockStructure,
  MOCK_TIMEBLOCKS,
} from './timeblocks.service.spec';

describe('TimeblocksController', () => {
  let controller: TimeblocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeblocksController],
      providers: [TimeblocksService],
    }).compile();

    controller = module.get<TimeblocksController>(TimeblocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a timeblock', () => {
    // Given
    const timeblock = controller.create(
      createMockTimeblock(MOCK_TIMEBLOCKS.timeblock1),
    );
    // When
    const result = controller.findOne(timeblock.id.toString());
    // Then
    expect(result).toEqual(
      expectTimeblockStructure(MOCK_TIMEBLOCKS.timeblock1),
    );

    expect(timeblock).toEqual(
      expectTimeblockStructure(MOCK_TIMEBLOCKS.timeblock1),
    );
  });

  it('should return all timeblocks', () => {
    // Given
    const timeblocks = controller.findAll();
    // When
    const result = controller.findAll();
    // Then
    expect(result).toEqual(timeblocks);
  });

  it('should return a timeblock by id', () => {
    // Given
    const timeblock = controller.create(
      createMockTimeblock(MOCK_TIMEBLOCKS.timeblock1),
    );
    // When
    const result = controller.findOne(timeblock.id.toString());
    // Then
    expect(result).toEqual(
      expectTimeblockStructure(MOCK_TIMEBLOCKS.timeblock1),
    );
  });

  it('should update a timeblock', () => {
    // Given
    const timeblock = controller.create(
      createMockTimeblock(MOCK_TIMEBLOCKS.timeblock1),
    );
    const updateTimeblockDto = {
      description: 'Updated Timeblock',
    };
    const expectedUpdatedTimeblock = {
      ...MOCK_TIMEBLOCKS.timeblock1,
      description: 'Updated Timeblock',
    };
    // When
    const updatedTimeblock = controller.update(
      timeblock.id.toString(),
      updateTimeblockDto,
    );
    const fetchedTimeblock = controller.findOne(timeblock.id.toString());
    // Then
    expect(fetchedTimeblock).toEqual(
      expectTimeblockStructure(expectedUpdatedTimeblock),
    );
    expect(updatedTimeblock).toEqual(
      expectTimeblockStructure(expectedUpdatedTimeblock),
    );
  });

  it('should return a user friendly error if the timeblock is not found', () => {
    // When
    const result = controller.update('999', {
      description: 'Updated Timeblock',
    });
    // Then
    expect(result).toBe('Timeblock not found');
  });

  it('should delete a timeblock', () => {
    // Given
    const timeblock = controller.create(
      createMockTimeblock(MOCK_TIMEBLOCKS.timeblock1),
    );
    // When
    const result = controller.remove(timeblock.id.toString());
    const fetchedTimeblock = controller.findOne(timeblock.id.toString());
    // Then
    expect(fetchedTimeblock).toBe('Timeblock not found');
    expect(result).toBe('Timeblock deleted');
  });

  it('should return a user friendly error if the timeblock is not found', () => {
    // When
    const result = controller.remove('999');
    // Then
    expect(result).toBe('Timeblock not found');
  });
});
