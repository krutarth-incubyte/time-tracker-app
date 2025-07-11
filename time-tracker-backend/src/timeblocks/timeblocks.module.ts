import { Module } from '@nestjs/common';
import { TimeblocksService } from './timeblocks.service';
import { TimeblocksController } from './timeblocks.controller';

@Module({
  controllers: [TimeblocksController],
  providers: [TimeblocksService],
})
export class TimeblocksModule {}
