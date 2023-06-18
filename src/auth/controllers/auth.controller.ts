import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { serializeSingleResponse } from '@Core/utils';
import { SingleResponseDoc } from '@Core/docs';
import { ApiSingleResponse } from '@Core/decorators';
import { UserDoc } from '@Users/docs';

import { AuthService } from '../services';
import { LoginDto } from '../dto';
import { CreateUserDto } from '@Users/dto';

@ApiTags('Authentication endpoints')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiSingleResponse(UserDoc)
  @ApiOperation({
    description: 'User this endpoint to authenticate',
    summary: 'Login',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<SingleResponseDoc<UserDoc>> {
    const user = await this.authService.login(loginDto);
    return serializeSingleResponse(UserDoc, user);
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
}
