import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ICurrentUser } from '@Core/interfaces';
import { PaginationDto } from '@Core/dtos';

import { CreateNoteDto, UpdateNoteDto } from '../dto';
import { NotesRepository } from '../repositories';
import { Note } from '../entities';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}
  async create(
    createNoteDto: CreateNoteDto,
    currentUser: ICurrentUser,
  ): Promise<Note> {
    const titleInUse = await this.notesRepository.findOneNoteByTitle(
      createNoteDto.title,
      currentUser,
    );

    const noteBelongsToUser = titleInUse?.user.id === currentUser.sub;
    if (titleInUse && noteBelongsToUser) {
      throw new ConflictException(
        `Note with title '${titleInUse.title}' already exists`,
      );
    }

    const noteToCreate = {
      ...createNoteDto,
      user: {
        id: currentUser.sub,
      },
    };
    const noteToSave = this.notesRepository.create(noteToCreate);
    return this.notesRepository.save(noteToSave);
  }

  findAll(
    user: ICurrentUser,
    isArchived: boolean,
    pagination: PaginationDto,
  ): Promise<[Note[], number]> {
    return this.notesRepository.findAll(user, isArchived, pagination);
  }

  async findOneById(id: string, currentUser: ICurrentUser): Promise<Note> {
    const note = await this.notesRepository.findOneNoteById(id, currentUser);
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    const noteBelongsToDiffUser = note.user.id !== currentUser.sub;
    if (noteBelongsToDiffUser) {
      throw new ConflictException(
        `Note with id ${id} belongs to different user`,
      );
    }
    return note;
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    currentUser: ICurrentUser,
  ): Promise<Note> {
    const note = await this.findOneById(id, currentUser);

    if (updateNoteDto.title) {
      const newTitleInUse = await this.notesRepository.findOneNoteByTitle(
        note.title,
        currentUser,
      );
      if (newTitleInUse) {
        throw new ConflictException(
          `Note with title ${updateNoteDto.title} already exists`,
        );
      }
      note.title = updateNoteDto.title;
    }

    if (updateNoteDto.content) {
      note.content = updateNoteDto.content;
    }
    return this.notesRepository.save({ id });
  }

  async remove(id: string, currentUser: ICurrentUser): Promise<void> {
    const note = await this.findOneById(id, currentUser);
    this.notesRepository.remove(note);
    return;
  }
}
