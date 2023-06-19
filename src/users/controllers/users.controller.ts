import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  serializeMultipleResponse,
  serializeSingleResponse,
} from '@Core/utils';
import { IdParamDto, PaginationDto } from '@Core/dtos';
import { MultipleResponseDoc, SingleResponseDoc } from '@Core/docs';
import { ApiPaginatedResponse, ApiSingleResponse } from '@Core/decorators';
import { JwtAuthGuard } from '@Auth/guards';

import { UpdateUserDto } from '../dto';
import { UsersService } from '../services';
import { UserDoc } from '../docs';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User management endpoints')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @ApiSingleResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to update a user by a given ID',
    summary: 'Update user',
  })
  @Patch(':id')
  async update(
    @Param('id') id: IdParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SingleResponseDoc<UserDoc>> {
    const user = await this.usersService.update(id.id, updateUserDto);
    return serializeSingleResponse(UserDoc, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: IdParamDto): Promise<void> {
    return await this.usersService.remove(id.id);
  }
}
