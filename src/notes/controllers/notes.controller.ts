import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AccessTokenGuard, JwtAuthGuard } from '@Auth/guards';
import {
  ApiPaginatedResponse,
  ApiSingleResponse,
  ReqUser,
} from '@Core/decorators';
import {
  serializeMultipleResponse,
  serializeSingleResponse,
} from '@Core/utils';
import { ICurrentUser } from '@Core/interfaces';
import { PaginationDto } from '@Core/dtos';
import { MultipleResponseDoc, SingleResponseDoc } from '@Core/docs';

import { NotesService } from '../services';
import { CreateNoteDto, QueryArchivedDto, UpdateNoteDto } from '../dto';
import { NoteDoc } from '../docs';

@ApiBearerAuth()
@ApiTags('Notes management endpoints')
@UseGuards(JwtAuthGuard, AccessTokenGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiSingleResponse(NoteDoc)
  @ApiOperation({
    description: 'Use this endpoint to create a new note',
    summary: 'Create a note',
  })
  @Post()
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @ReqUser() user: ICurrentUser,
  ) {
    return this.notesService.create(createNoteDto, user);
  }

  @ApiPaginatedResponse(NoteDoc)
  @ApiOperation({
    description: `
Use this endpoint to retrieve your active or inactive notes.\n
Use 'archived' query parameter to choose the state of the notes.\n
Use 'archived=true' to retrieve archived notes.\n
Use 'archived=false' to retrieve active notes.\n
If no value is given, active notes will be retrieved.
`,
    summary: 'Retrieves active/inactive notes',
  })
  @Get()
  async findAll(
    @ReqUser() user: ICurrentUser,
    @Query() archived: QueryArchivedDto,
    @Query() pagination: PaginationDto,
  ): Promise<MultipleResponseDoc<NoteDoc[]>> {
    const [notes, total] = await this.notesService.findAll(
      user,
      archived.archived,
      pagination,
    );
    return serializeMultipleResponse(NoteDoc, notes, pagination, total);
  }

  @ApiSingleResponse(NoteDoc)
  @ApiOperation({
    description: 'Use this endpoint to find a note from a given id',
    summary: 'Find a note',
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @ReqUser() user: ICurrentUser,
  ): Promise<SingleResponseDoc<NoteDoc>> {
    const note = await this.notesService.findOneById(id, user);
    return serializeSingleResponse(NoteDoc, note);
  }

  @ApiSingleResponse(NoteDoc)
  @ApiOperation({
    description: `Use this endpoint to update a note's title and/or description`,
    summary: 'Update a note',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @ReqUser() user: ICurrentUser,
  ): Promise<SingleResponseDoc<NoteDoc>> {
    const note = await this.notesService.update(id, updateNoteDto, user);
    return serializeSingleResponse(NoteDoc, note);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({
    description: `Use this endpoint to delete a note given its id`,
    summary: `Delete a note`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @ReqUser() user: ICurrentUser,
  ): Promise<void> {
    return this.notesService.remove(id, user);
  }
}
