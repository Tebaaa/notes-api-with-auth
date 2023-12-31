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

import { BlacklistRepository, TokenRepository } from '../repositories';
import { Blacklist, Token } from '../entities';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
    private readonly blacklistRepository: BlacklistRepository,
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
    const tokenInBlacklist =
      await this.blacklistRepository.findOneByRefreshToken(refreshToken);
    if (!token || tokenInBlacklist) {
      throw new UnauthorizedException('Invalid token');
    }
    const { user } = token;

    await this.tokenRepository.delete({ id: token.id });
    await this.addTokenToBlacklist(token.accessToken, token.refreshToken);
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

  async addTokenToBlacklist(
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const alreadyExists = await this.blacklistRepository.findOneByAccessToken(
      accessToken,
    );
    if (alreadyExists) {
      return;
    }
    await this.blacklistRepository.save({ accessToken, refreshToken });
  }

  async removeToken(token: Token): Promise<void> {
    await this.tokenRepository.remove(token);
  }

  async getBlacklistedTokenByAccessToken(
    accessToken: string,
  ): Promise<Blacklist> {
    return this.blacklistRepository.findOneByAccessToken(accessToken);
  }
}
