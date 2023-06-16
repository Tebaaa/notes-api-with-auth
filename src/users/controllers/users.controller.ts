import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  serializeMultipleResponse,
  serializeSingleResponse,
} from '@Core/utils';
import { IdParamDto, PaginationDto } from '@Core/dtos';
import { MultipleResponseDoc, SingleResponseDoc } from '@Core/docs';
import { ApiPaginatedResponse, ApiSingleResponse } from '@Core/decorators';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { UsersService } from '../services';
import { UserDoc } from '../docs';

@ApiTags('User management endpoints')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiSingleResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to create an user',
    summary: 'Create user',
  })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SingleResponseDoc<UserDoc>> {
    const user = await this.usersService.create(createUserDto);
    return serializeSingleResponse(UserDoc, user);
  }

  @ApiPaginatedResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve users paginated',
    summary: 'Get users',
  })
  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<MultipleResponseDoc<UserDoc[]>> {
    const [users, total] = await this.usersService.findAll(pagination);
    return serializeMultipleResponse(UserDoc, users, pagination, total);
  }

  @ApiSingleResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to find a user by a given ID',
    summary: 'Get user by ID',
  })
  @Get(':id')
  async findOne(
    @Param('id') id: IdParamDto,
  ): Promise<SingleResponseDoc<UserDoc>> {
    const user = await this.usersService.findOneById(id.id);
    return serializeSingleResponse(UserDoc, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
