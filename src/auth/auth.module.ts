import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModuleConfig } from '@Core/config';

import { AuthController } from './controllers';
import { AuthService, TokenService } from './services';
import { Token } from './entities';
import { TokenRepository } from './repositories';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.registerAsync(JwtModuleConfig),
    TypeOrmModule.forFeature([Token]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, TokenRepository, JwtStrategy],
})
export class AuthModule {}
