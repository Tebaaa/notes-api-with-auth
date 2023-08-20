import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { User } from '@Users/entities';

import { BlacklistRepository, TokenRepository } from '../repositories';
import { Blacklist, Token } from '../entities';
import { TokenService } from '../services';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: DeepMocked<JwtService>;
  let tokenRepository: DeepMocked<TokenRepository>;
  let blacklistRepository: DeepMocked<BlacklistRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: TokenRepository,
          useValue: createMock<TokenRepository>(),
        },
        {
          provide: BlacklistRepository,
          useValue: createMock<BlacklistRepository>(),
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get(JwtService);
    tokenRepository = module.get(TokenRepository);
    blacklistRepository = module.get(BlacklistRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should return a jwt token', () => {
      const expectedReturn = 'fake-jwt-token';
      jwtService.sign.mockReturnValue(expectedReturn);
      const returnedValue = service.generateAccessToken(createMock<User>());
      expect(returnedValue).toEqual(expectedReturn);
    });
  });

  it.todo('generateRefreshToken');

  it.todo('persistTokens');

  it.todo('verifyRefreshToken');

  describe('refreshTokens', () => {
    describe('when token is not in database', () => {
      it('should throw an UnauthorizedException', async () => {
        tokenRepository.getByRefreshToken.mockResolvedValue(undefined);
        try {
          await service.refreshTokens('fake-jwt-token');
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException);
        }
      });
    });
    describe('when token is blacklisted', () => {
      it('should throw an UnauthorizedException', async () => {
        const token = createMock<Token>();
        tokenRepository.getByRefreshToken.mockResolvedValue(token);
        blacklistRepository.findOneByRefreshToken.mockResolvedValue(token);

        try {
          await service.refreshTokens('fake-jwt-token');
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException);
        }
      });
    });
    describe('otherwise', () => {
      it('should return a new token from database', async () => {
        const existingToken = createMock<Token>();
        const expectedReturn = createMock<Token>();

        tokenRepository.getByRefreshToken.mockResolvedValue(existingToken);
        blacklistRepository.findOneByRefreshToken.mockResolvedValue(undefined);
        jest.spyOn(service, 'persistTokens').mockResolvedValue(expectedReturn);

        const returnedValue = await service.refreshTokens('fake-jwt-token');

        expect(tokenRepository.delete).toBeCalled();
        expect(returnedValue).toEqual(expectedReturn);
      });
    });
  });

  describe('getTokenFromBearer', () => {
    describe('if authorization header not provided', () => {
      it('should throw UnauthorizedException', () => {
        const request = createMock<Request>({
          headers: { authorization: undefined },
        });
        try {
          service.getTokenFromBearer(request);
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException);
        }
      });
    });
    describe('otherwise', () => {
      it('should return the jwt token', () => {
        const expectedReturn = 'fake-jwt-token';
        const request = createMock<Request>({
          headers: { authorization: `Bearer ${expectedReturn}` },
        });
        const returnedValue = service.getTokenFromBearer(request);
        expect(returnedValue).toEqual(expectedReturn);
      });
    });
  });

  describe('getDBTokenByAccessToken', () => {
    it('should return a database token', async () => {
      const expectedReturn = createMock<Token>();
      tokenRepository.getByAccessToken.mockResolvedValue(expectedReturn);

      const returnedValue =
        await service.getDBTokenByAccessToken('fake-jwt-token');

      expect(returnedValue).toEqual(expectedReturn);
    });
  });

  describe('addTokenToBlacklist', () => {
    describe('if it already exists', () => {
      it('should do nothing', async () => {
        const blacklisted = createMock<Blacklist>();
        blacklistRepository.findOneByAccessToken.mockResolvedValue(blacklisted);
        const { accessToken, refreshToken } = blacklisted;

        await service.addTokenToBlacklist(accessToken, refreshToken);

        expect(blacklistRepository.save).toHaveBeenCalledTimes(0);
      });
    });
    describe('otherwise', () => {
      it('should save it in database', async () => {
        blacklistRepository.findOneByAccessToken.mockResolvedValue(undefined);

        await service.addTokenToBlacklist(
          'fake-access-token',
          'fake-refresh-token',
        );

        expect(blacklistRepository.save).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('removeToken', () => {
    it('should remove token from database', async () => {
      await service.removeToken(createMock<Token>());

      expect(tokenRepository.remove).toHaveBeenCalled();
    });
  });

  describe('getBlacklistedTokenByAccessToken', () => {
    it('should get a blacklisted token from database', async () => {
      const expectedReturn = createMock<Blacklist>();
      blacklistRepository.findOneByAccessToken.mockResolvedValue(
        expectedReturn,
      );

      const returnedValue = await service.getBlacklistedTokenByAccessToken(
        expectedReturn.accessToken,
      );

      expect(returnedValue).toEqual(expectedReturn);
    });
  });
});
