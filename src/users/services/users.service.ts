import { Injectable } from '@nestjs/common';

import { PaginationDto } from '@Core/dtos';

import { CreateUserDto, UpdateUserDto } from '../dto/';
import { UsersRepository } from '../repositories';
import { User } from '../entities';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll(pagination: PaginationDto): Promise<[User[], number]> {
    return this.usersRepository.findAll(pagination);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findOneById(id: string) {
    const user = await this.usersRepository.findOneById(id);
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
