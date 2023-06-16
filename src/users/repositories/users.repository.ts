import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto } from '@Core/dtos';
import { getSkipAndTake } from '@Core/utils';

import { User } from '../entities';

export class UsersRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAll(pagination: PaginationDto): Promise<[User[], number]> {
    const { skip, take } = getSkipAndTake(pagination);
    const usersAndCount = await this.repository.findAndCount({ skip, take });
    return usersAndCount;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    return user;
  }
}
