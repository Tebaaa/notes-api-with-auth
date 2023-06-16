import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;
    const emailOccupied = await this.findOneByEmail(email);
    if (emailOccupied) {
      throw new ConflictException(`Email ${email} already in use`);
    }
    const usernameOccupied = await this.findOneByUsername(username);
    if (usernameOccupied) {
      throw new ConflictException(`Username ${username} already in use`);
    }
    const salt = await genSalt();
    const encriptedPassword = await hash(password, salt);
    createUserDto.password = encriptedPassword;
    const createdUser = await this.usersRepository.save(createUserDto);
    return createdUser;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneByEmail(email);
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneByUsername(username);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
