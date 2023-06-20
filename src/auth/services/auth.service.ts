import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isEmail } from 'class-validator';
import { compare } from 'bcrypt';
import { Request } from 'express';

import { CreateUserDto } from '@Users/dto';
import { User } from '@Users/entities';

import { LoginDto } from '../dto';
import { LoginInfoDoc, TokenDoc } from '../docs';
import { TokenService } from '.';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async login({ user, password }: LoginDto): Promise<LoginInfoDoc> {
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

    const token = await this.tokenService.persistTokens(loggedInUser);
    return { user: loggedInUser, tokens: token };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const [createdUser] = await this.eventEmitter.emitAsync(
      'createUser',
      createUserDto,
    );
    return createdUser;
  }

  async refreshToken(token: string): Promise<TokenDoc> {
    this.tokenService.verifyRefreshToken(token);
    const { accessToken, refreshToken } = await this.tokenService.refreshTokens(
      token,
    );
    return { accessToken, refreshToken };
  }

  async logout(req: Request): Promise<void> {
    const jwtToken = this.tokenService.getTokenFromBearer(req);
    const dbToken = await this.tokenService.getDBTokenByAccessToken(jwtToken);
    if (!dbToken) {
      throw new NotFoundException('Token not found in database');
    }
    const { accessToken, refreshToken } = dbToken;
    await this.tokenService.addTokenToBlacklist(accessToken, refreshToken);
    await this.tokenService.removeToken(dbToken);
  }
}
