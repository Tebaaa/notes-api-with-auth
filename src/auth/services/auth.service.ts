import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isEmail } from 'class-validator';
import { compare } from 'bcrypt';

import { User } from '@Users/entities';

import { LoginDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async login({ user, password }: LoginDto): Promise<User> {
    let loggedInUser: unknown;
    if (isEmail(user)) {
      [loggedInUser] = await this.eventEmitter.emitAsync(
        'getOneUserByEmail',
        user,
      );
    } else {
      [loggedInUser] = await this.eventEmitter.emitAsync(
        'getOneUserByUsername',
        user,
      );
    }
    if (!(loggedInUser instanceof User)) {
      throw new UnauthorizedException('Username or email is incorrect');
    }
    const correctPassword = await compare(password, loggedInUser.password);
    if (!correctPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return loggedInUser;
  }
}
