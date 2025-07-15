import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeblockDto } from './create-timeblock.dto';

export class UpdateTimeblockDto extends PartialType(CreateTimeblockDto) {}
