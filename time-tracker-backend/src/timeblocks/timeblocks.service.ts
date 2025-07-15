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
      createdAt: new Date(),
    };
    this.timeblocks.push(timeblock);
    return timeblock;
  }

  findAll(): Timeblock[] {
    return this.timeblocks;
  }

  findOne(id: number) {
    const timeblock = this.timeblocks.find((timeblock) => timeblock.id === id);
    if (!timeblock) {
      return 'Timeblock not found';
    }
    return timeblock;
  }

  update(id: number, updateTimeblockDto: UpdateTimeblockDto) {
    const timeblock = this.timeblocks.find((timeblock) => timeblock.id === id);
    if (!timeblock) {
      return 'Timeblock not found';
    }
    const updatedTimeblock = {
      ...timeblock,
      ...updateTimeblockDto,
    };
    this.timeblocks = this.timeblocks.map((timeblock) =>
      timeblock.id === id ? updatedTimeblock : timeblock,
    );
    return updatedTimeblock;
  }

  remove(id: number) {
    const timeblock = this.timeblocks.find((timeblock) => timeblock.id === id);
    if (!timeblock) {
      return 'Timeblock not found';
    }
    this.timeblocks = this.timeblocks.filter(
      (timeblock) => timeblock.id !== id,
    );
    return 'Timeblock deleted';
  }
}
