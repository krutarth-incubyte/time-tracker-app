import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TimeblocksService } from './timeblocks.service';
import { CreateTimeblockDto } from './dto/create-timeblock.dto';
import { UpdateTimeblockDto } from './dto/update-timeblock.dto';

@Controller('timeblocks')
export class TimeblocksController {
  constructor(private readonly timeblocksService: TimeblocksService) {}

  @Post()
  create(@Body() createTimeblockDto: CreateTimeblockDto) {
    return this.timeblocksService.create(createTimeblockDto);
  }

  @Get()
  findAll() {
    return this.timeblocksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeblocksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeblockDto: UpdateTimeblockDto,
  ) {
    return this.timeblocksService.update(+id, updateTimeblockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeblocksService.remove(+id);
  }
}
