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
import { ApiOperation } from '@nestjs/swagger';

import { PaginationDto } from '@Core/dtos';
import { MultipleResponseDoc } from '@Core/docs';
import { serializeMultipleResponse } from '@Core/utils';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { UsersService } from '../services';
import { UserDoc } from '../docs';
import { ApiPaginatedResponse } from '@Core/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
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
