import { Injectable } from '@nestjs/common';
import { CreateTimeblockDto } from './dto/create-timeblock.dto';
import { UpdateTimeblockDto } from './dto/update-timeblock.dto';
import { Timeblock } from './entities/timeblock.entity';

@Injectable()
export class TimeblocksService {
  private timeblocks: Timeblock[] = [];

  create(createTimeblockDto: CreateTimeblockDto): Timeblock {
    const timeblock: Timeblock = {
      id: this.timeblocks.length + 1,
      taskId: createTimeblockDto.taskId,
      start: createTimeblockDto.start,
      end: createTimeblockDto.end,
      description: createTimeblockDto.description,
    };
    this.timeblocks.push(timeblock);
    return timeblock;
  }

  findAll(): Timeblock[] {
    return this.timeblocks;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeblock`;
  }

  update(id: number, updateTimeblockDto: UpdateTimeblockDto) {
    return `This action updates a #${id} timeblock`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeblock`;
  }
}
