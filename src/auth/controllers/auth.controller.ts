import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { serializeSingleResponse } from '@Core/utils';
import { SingleResponseDoc } from '@Core/docs';
import { ApiSingleResponse } from '@Core/decorators';
import { UserDoc } from '@Users/docs';
import { CreateUserDto } from '@Users/dto';

import { AuthService } from '../services';
import { LoginDto, RefreshTokenDto } from '../dto';
import { LoginInfoDoc, TokenDoc } from '../docs';

@ApiTags('Authentication endpoints')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiSingleResponse(LoginInfoDoc)
  @ApiOperation({
    description: 'User this endpoint to authenticate',
    summary: 'Login',
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<SingleResponseDoc<LoginInfoDoc>> {
    const loginInfo = await this.authService.login(loginDto);
    return serializeSingleResponse(LoginInfoDoc, loginInfo);
  }

  @ApiSingleResponse(UserDoc, HttpStatus.CREATED)
  @ApiOperation({
    description: 'Use this endpoint to register as user',
    summary: 'Register',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SingleResponseDoc<UserDoc>> {
    const user = await this.authService.register(createUserDto);
    return serializeSingleResponse(UserDoc, user);
  }

  @ApiOperation({
    description: 'Use this endpoint if you want to refresh your access token',
    summary: 'Refresh access token',
  })
  @ApiSingleResponse(TokenDoc)
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SingleResponseDoc<TokenDoc>> {
    const tokens = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return serializeSingleResponse(TokenDoc, tokens);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Use this endpoint to logout',
    summary: 'Logout',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('logout')
  async logout(@Req() req: Request): Promise<void> {
    await this.authService.logout(req);
  }
}
