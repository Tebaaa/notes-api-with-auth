import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

import { User } from '@Users/entities';

import { TokenRepository } from '../repositories';
import { Token } from '../entities';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  generateAccessToken(user: User): string {
    const { id, username, email } = user;
    const payload = {
      sub: id,
      username,
      email,
    };
    try {
      return this.jwtService.sign(payload);
    } catch (err) {
      console.log(err);
      console.log(this.configService.get('ACCESS_TOKEN_SECRET'));

      throw new InternalServerErrorException(
        `Access token generation failed for ${user.email}`,
      );
    }
  }

  generateRefreshToken(user: User): string {
    const secret = this.configService.get('REFRESH_TOKEN_SECRET');
    const expirationPeriod = `${this.configService.get(
      'REFRESH_TOKEN_EXPIRATION',
    )}s`;
    const { id, email, username } = user;
    const payload = {
      sub: id,
      email,
      username,
    };
    try {
      return sign(payload, secret, { expiresIn: expirationPeriod });
    } catch {
      throw new InternalServerErrorException(
        `Refresh token generation failed for ${user.email}`,
      );
    }
  }

  persistTokens(user: User): Promise<Token> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const newToken = this.tokenRepository.create({
      user,
      accessToken,
      refreshToken,
    });

    return this.tokenRepository.save(newToken);
  }

  verifyRefreshToken(token: string): string | JwtPayload {
    const secret = this.configService.get('REFRESH_TOKEN_SECRET');
    try {
      return verify(token, secret);
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  async refreshTokens(refreshToken: string): Promise<Token> {
    const token = await this.tokenRepository.getByRefreshToken(refreshToken);
    //TODO: check if token is in blacklist
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    console.log(token);
    const { user } = token;

    await this.tokenRepository.delete({ id: token.id });
    return this.persistTokens(user);
  }

  getTokenFromBearer(req: Request): string {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('Bearer not provided');
    }
    return authorization.split(' ')[1];
  }

  async getDBTokenByAccessToken(accessToken: string): Promise<Token> {
    return this.tokenRepository.getByAccessToken(accessToken);
  }
}
