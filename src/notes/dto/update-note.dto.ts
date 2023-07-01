import { PartialType } from '@nestjs/swagger';

import { CreateNoteDto } from '.';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
