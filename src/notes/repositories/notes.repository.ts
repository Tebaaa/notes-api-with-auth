import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ICurrentUser } from '@Core/interfaces';
import { PaginationDto } from '@Core/dtos';
import { getSkipAndTake } from '@Core/utils';

import { Note } from '../entities';

export class NotesRepository extends Repository<Note> {
  constructor(
    @InjectRepository(Note)
    private repository: Repository<Note>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  findOneNoteById(id: string, currentUser: ICurrentUser): Promise<Note> {
    return this.repository.findOne({
      where: { id, user: { id: currentUser.sub } },
      relations: ['user'],
    });
  }

  findOneNoteByTitle(title: string, currentUser: ICurrentUser): Promise<Note> {
    const id = currentUser.sub;
    return this.repository.findOne({
      where: { title: ILike(title), user: { id } },
      relations: ['user'],
    });
  }

  findAll(
    currentUser: ICurrentUser,
    isArchived: boolean,
    pagination: PaginationDto,
  ): Promise<[Note[], number]> {
    const { skip, take } = getSkipAndTake(pagination);
    return this.repository.findAndCount({
      where: { user: { id: currentUser.sub }, isArchived },
      skip,
      take,
    });
  }
}
