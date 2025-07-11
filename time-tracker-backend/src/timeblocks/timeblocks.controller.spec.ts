import { Test, TestingModule } from '@nestjs/testing';
import { TimeblocksController } from './timeblocks.controller';
import { TimeblocksService } from './timeblocks.service';

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
});
