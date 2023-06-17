import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { UsersRepository } from '@Users/repositories';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { describe } from 'node:test';
import { User } from '@Users/entities';
import { PaginationDto } from '@Core/dtos';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@Users/dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: DeepMocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: createMock<UsersRepository>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const expectedReturn = createMock<Promise<[User[], number]>>();
      usersRepository.findAll.mockResolvedValueOnce(expectedReturn);
      const returnedValue = await service.findAll(createMock<PaginationDto>());
      expect(returnedValue).toEqual(expectedReturn);
    });
  });

  describe('findOneById', () => {
    describe('when user with id is not found', () => {
      it('should throw a NotFoundException', async () => {
        usersRepository.findOneById.mockReturnValueOnce(undefined);
        try {
          await service.findOneById('fakeid');
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
    describe('otherwise', () => {
      it('should return user with id', async () => {
        const fakeid = 'fakeid';
        const expectedUser = createMock<User>({ id: fakeid });
        usersRepository.findOneById.mockResolvedValueOnce(expectedUser);
        const returnedValue = await service.findOneById('fakeid');
        expect(returnedValue.id).toEqual(expectedUser.id);
        expect(returnedValue).toEqual(expectedUser);
      });
    });
  });

  describe('create', () => {
    describe('when email is occupied', () => {
      it('should throw a ConflictException', async () => {
        usersRepository.findOneByEmail.mockResolvedValueOnce(
          createMock<User>(),
        );
        try {
          await service.create(createMock<CreateUserDto>());
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toContain('Email');
        }
      });
    });
    describe('when username is occupied', () => {
      it('should throw a ConflictException', async () => {
        usersRepository.findOneByEmail.mockResolvedValueOnce(undefined);
        usersRepository.findOneByUsername.mockResolvedValueOnce(
          createMock<User>(),
        );
        try {
          await service.create(createMock<CreateUserDto>());
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toContain('Username');
        }
      });
    });
    describe('otherwise', () => {
      it('should create an user', async () => {
        usersRepository.findOneByEmail.mockResolvedValueOnce(undefined);
        usersRepository.findOneByUsername.mockResolvedValueOnce(undefined);
        const expectedReturn = createMock<Promise<User>>();
        usersRepository.save.mockResolvedValueOnce(expectedReturn);
        const returnedValue = await service.create(createMock<CreateUserDto>());
        expect(returnedValue).toEqual(expectedReturn);
      });
    });
  });

  describe('update', () => {
    describe('when user is not found', () => {
      it('should throw a NotFoundException', async () => {
        usersRepository.findOneById.mockResolvedValueOnce(undefined);
        try {
          await service.update('fakeId', createMock<UpdateUserDto>());
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
    describe('otherwise', () => {
      it('should update the user', async () => {
        const updateUserDto = createMock<UpdateUserDto>();
        const expectedReturn = createMock<User>({
          ...updateUserDto,
          id: 'fakeId',
        });

        usersRepository.findOneById.mockResolvedValueOnce(expectedReturn);
        usersRepository.save.mockResolvedValueOnce(expectedReturn);

        const returnedValue = await service.update('fakeId', updateUserDto);

        expect(returnedValue).toEqual(expectedReturn);
      });
    });
  });
});
