import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { ICurrentUser } from '@Core/interfaces';
import { PaginationDto } from '@Core/dtos';

import { NotesService } from '../services/notes.service';
import { NotesRepository } from '../repositories';
import { CreateNoteDto, UpdateNoteDto } from '../dto';
import { Note } from '../entities';

describe('NotesService', () => {
  let service: NotesService;
  let notesRepository: DeepMocked<NotesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: NotesRepository,
          useValue: createMock<NotesRepository>(),
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    notesRepository = module.get(NotesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    describe('when creating a note with a existing title', () => {
      it('should throw a ConflictException', async () => {
        const currentUser = createMock<ICurrentUser>({ sub: 'fake-id' });
        const createNoteDto = createMock<CreateNoteDto>();
        notesRepository.findOneNoteByTitle.mockResolvedValueOnce(
          createMock<Note>({ user: { id: currentUser.sub } }),
        );
        try {
          await service.create(createNoteDto, currentUser);
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
        }
      });
    });
    describe('otherwise', () => {
      it('should create a new note', async () => {
        const currentUser = createMock<ICurrentUser>();
        const createNoteDto = createMock<CreateNoteDto>();
        const expectedReturn = createMock<Note>({ ...createNoteDto });

        notesRepository.create.mockReturnValue(expectedReturn);
        notesRepository.save.mockResolvedValueOnce(expectedReturn);

        const returnedValue = await service.create(createNoteDto, currentUser);

        expect(returnedValue).toEqual(expectedReturn);
      });
    });
  });

  describe('findAll', () => {
    describe(`when 'isArchived' param is given`, () => {
      it('should return all archived or unarchived notes', async () => {
        const currentUser = createMock<ICurrentUser>();
        const pagination = createMock<PaginationDto>();
        const expectedReturn = createMock<[Note[], number]>();

        notesRepository.findAll.mockResolvedValueOnce(expectedReturn);

        const returnedValue = await service.findAll(
          currentUser,
          true,
          pagination,
        );

        expect(returnedValue).toEqual(expectedReturn);
      });
      describe('otherwise', () => {
        it('should return active notes', async () => {
          const currentUser = createMock<ICurrentUser>();
          const pagination = createMock<PaginationDto>();

          await service.findAll(currentUser, undefined, pagination);

          expect(notesRepository.findAll).toBeCalledWith(
            currentUser,
            false,
            pagination,
          );
        });
      });
    });
  });

  describe('findOneById', () => {
    describe('when note is not found', () => {
      it('should throw a NotFoundException', async () => {
        const currentUser = createMock<ICurrentUser>();

        notesRepository.findOneNoteById.mockResolvedValueOnce(undefined);

        try {
          await service.findOneById('fake-id', currentUser);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });

    describe('otherwise', () => {
      it('should return the note', async () => {
        const id = 'fake-id';
        const currentUser = createMock<ICurrentUser>();

        const expectedReturn = createMock<Note>({
          id,
          user: { id: currentUser.sub },
        });

        notesRepository.findOneNoteById.mockResolvedValueOnce(expectedReturn);

        const returnedValue = await service.findOneById(id, currentUser);

        expect(returnedValue).toEqual(expectedReturn);
      });
    });
  });

  describe('update', () => {
    describe('given an id', () => {
      describe('when note is not found', () => {
        it('should throw a NotFound Exception', async () => {
          const id = 'fake-id';
          const updateNoteDto = createMock<UpdateNoteDto>();
          const currentUser = createMock<ICurrentUser>();
          notesRepository.findOneNoteById.mockResolvedValueOnce(undefined);
          try {
            await service.update(id, updateNoteDto, currentUser);
          } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
          }
        });
      });
      describe('when new title is already in use', () => {
        it('should throw a Conflict exception', async () => {
          const id = 'fake-id';
          const updateNoteDto = createMock<UpdateNoteDto>();
          const currentUser = createMock<ICurrentUser>();
          const note = createMock<Note>({ id, ...updateNoteDto });
          jest.spyOn(service, 'findOneById').mockResolvedValueOnce(note);
          notesRepository.findOneNoteByTitle.mockResolvedValueOnce(note);

          try {
            await service.update(id, updateNoteDto, currentUser);
          } catch (error) {
            expect(error).toBeInstanceOf(ConflictException);
            expect(error.message).toContain('title');
          }
        });
      });
      describe('otherwise', () => {
        it('should update the note', async () => {
          const id = 'fake-id';
          const updateNoteDto = createMock<UpdateNoteDto>();
          const currentUser = createMock<ICurrentUser>();
          const note = createMock<Note>({ id, ...updateNoteDto });

          jest.spyOn(service, 'findOneById').mockResolvedValueOnce(note);
          notesRepository.findOneNoteByTitle.mockResolvedValueOnce(undefined);
          notesRepository.save.mockResolvedValueOnce(note);

          const returnedValue = await service.update(
            id,
            updateNoteDto,
            currentUser,
          );
          expect(returnedValue).toEqual(note);
        });
      });
    });
  });

  describe('remove', () => {
    describe('given an id', () => {
      describe('when note is not found', () => {
        it('should throw a NotFound Exception', async () => {
          const id = 'fake-id';
          const currentUser = createMock<ICurrentUser>();

          notesRepository.findOneNoteById.mockResolvedValueOnce(undefined);

          try {
            await service.remove(id, currentUser);
          } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
          }
        });
      });
      describe('otherwise', () => {
        it('should remove the note', async () => {
          const id = 'fake-id';
          const currentUser = createMock<ICurrentUser>();
          const note = createMock<Note>();

          jest.spyOn(service, 'findOneById').mockResolvedValueOnce(note);

          await service.remove(id, currentUser);

          expect(notesRepository.remove).toBeCalledWith(note);
        });
      });
    });
  });
});
