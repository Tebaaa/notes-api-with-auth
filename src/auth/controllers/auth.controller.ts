import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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

  //TODO: Implement local passport
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

  //TODO: Create logout :)
}
