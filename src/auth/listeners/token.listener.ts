import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Request } from 'express';

import { TokenService } from '../services';
import { Blacklist, Token } from '../entities';

@Injectable()
export class TokenListener implements Partial<TokenService> {
  constructor(private readonly tokenService: TokenService) {}

  @OnEvent('getTokenfromBearer')
  getTokenFromBearer(req: Request): string {
    if (!req) {
      throw new Error('No req parameter provided');
    }
    return this.tokenService.getTokenFromBearer(req);
  }

  @OnEvent('getDBTokenByAccessToken')
  getDBTokenByAccessToken(accessToken: string): Promise<Token> {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    return this.tokenService.getDBTokenByAccessToken(accessToken);
  }

  @OnEvent('getBlacklistedTokenByAccessToken')
  async getBlacklistedTokenByAccessToken(
    accessToken: string,
  ): Promise<Blacklist> {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    return this.tokenService.getBlacklistedTokenByAccessToken(accessToken);
  }
}
