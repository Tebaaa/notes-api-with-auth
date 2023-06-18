import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { serializeSingleResponse } from '@Core/utils';
import { SingleResponseDoc } from '@Core/docs';
import { ApiSingleResponse } from '@Core/decorators';
import { UserDoc } from '@Users/docs';

import { AuthService } from '../services';
import { LoginDto } from '../dto';

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
    console.log(user);

    return serializeSingleResponse(UserDoc, user);
  }
}
