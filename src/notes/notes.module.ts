import { Module } from '@nestjs/common';

import { NotesService } from './services';
import { NotesController } from './controllers';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
