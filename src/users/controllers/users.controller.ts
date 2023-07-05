import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@Auth/guards';
import { serializeSingleResponse } from '@Core/utils';
import { SingleResponseDoc } from '@Core/docs';
import { ApiSingleResponse, ReqUser } from '@Core/decorators';
import { ICurrentUser } from '@Core/interfaces';

import { UpdateUserDto } from '../dto';
import { UsersService } from '../services';
import { UserDoc } from '../docs';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Profile management endpoints')
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiSingleResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve your profile information',
    summary: 'Get my user information',
  })
  @Get()
  async findOne(
    @ReqUser() currentUser: ICurrentUser,
  ): Promise<SingleResponseDoc<UserDoc>> {
    const user = await this.usersService.findOneById(currentUser.sub);
    return serializeSingleResponse(UserDoc, user);
  }

  @ApiSingleResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to update your profile information',
    summary: 'Update profile ',
  })
  @Patch()
  async update(
    @ReqUser() currentUser: ICurrentUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SingleResponseDoc<UserDoc>> {
    const user = await this.usersService.update(currentUser.sub, updateUserDto);
    return serializeSingleResponse(UserDoc, user);
  }

  @ApiResponse({
    content: null,
    status: HttpStatus.NO_CONTENT,
  })
  @ApiOperation({
    description: 'Use this endpoint to delete your profile',
    summary: 'Delete profile ',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async remove(@ReqUser() currentUser: ICurrentUser): Promise<void> {
    return await this.usersService.remove(currentUser.sub);
  }
}
