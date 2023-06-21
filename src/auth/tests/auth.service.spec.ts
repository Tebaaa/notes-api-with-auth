import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '@Users/entities';
import { CreateUserDto } from '@Users/dto';

import { TokenDoc } from '../docs';
import { Token } from '../entities';
import { AuthService, TokenService } from '../services';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: DeepMocked<TokenService>;
  let eventEmitter: DeepMocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: createMock<TokenService>(),
        },
        {
          provide: EventEmitter2,
          useValue: createMock<EventEmitter2>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    tokenService = module.get(TokenService);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('Login');

  describe('register', () => {
    it('should return a created user', async () => {
      const createUserDto = createMock<CreateUserDto>();
      const expectedReturn = createMock<User>({ ...createUserDto });

      eventEmitter.emitAsync.mockResolvedValue([expectedReturn]);

      const returnedValue = await service.register(createUserDto);
      expect(returnedValue).toEqual(expectedReturn);
    });
  });

  describe('refreshToken', () => {
    it('should return an object with access & refresh tokens', async () => {
      const expectedReturn = createMock<TokenDoc>();

      tokenService.refreshTokens.mockResolvedValue(expectedReturn as Token);

      const returnedValue = await service.refreshToken('fake-token');

      const { accessToken, refreshToken } = expectedReturn;

      expect(returnedValue).toEqual({ accessToken, refreshToken });
    });
  });

  describe('logout', () => {
    describe('when token not in DB', () => {
      it('should throw a NotFoundException', async () => {
        tokenService.getDBTokenByAccessToken.mockResolvedValue(undefined);
        try {
          await service.logout(createMock<Request>());
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
    describe('otherwise', () => {
      it('should log out', async () => {
        tokenService.getDBTokenByAccessToken.mockResolvedValue(
          createMock<Token>(),
        );
        await service.logout(createMock<Request>());

        expect(tokenService.getTokenFromBearer).toBeCalled();
        expect(tokenService.getDBTokenByAccessToken).toBeCalled();
        expect(tokenService.addTokenToBlacklist).toBeCalled();
        expect(tokenService.removeToken).toBeCalled();
      });
    });
  });
});
