import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { CreateNoteDto } from '.';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  isArchived: boolean;
}
