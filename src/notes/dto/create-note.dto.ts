import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

import { Note } from '../entities';

export class CreateNoteDto implements Partial<Note> {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  content: string;
}
