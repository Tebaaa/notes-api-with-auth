import { CreateUserDto } from '@Users/dto';
import { User } from '@Users/entities';
import { UsersService } from '@Users/services';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserListener implements Partial<UsersService> {
  constructor(private readonly usersService: UsersService) {}

  @OnEvent('getOneUserByEmail')
  async findOneByEmail(email: string): Promise<User> {
    if (!email) {
      throw new Error('No email provided');
    }
    return await this.usersService.findOneByEmail(email);
  }

  @OnEvent('getOneUserByUsername')
  async findOneByUsername(username: string): Promise<User> {
    if (!username) {
      throw new Error('No username provided');
    }
    return await this.usersService.findOneByUsername(username);
  }

  @OnEvent('createUser')
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto) {
      throw new Error('No createUserDto provided');
    }
    return await this.usersService.create(createUserDto);
  }
}
