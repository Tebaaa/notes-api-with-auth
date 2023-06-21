import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModuleConfig } from '@Core/config';

import { AuthController } from './controllers';
import { AuthService, TokenService } from './services';
import { Blacklist, Token } from './entities';
import { BlacklistRepository, TokenRepository } from './repositories';
import { JwtStrategy } from './strategies';
import { TokenListener } from './listeners';

@Module({
  imports: [
    JwtModule.registerAsync(JwtModuleConfig),
    TypeOrmModule.forFeature([Token, Blacklist]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    TokenRepository,
    JwtStrategy,
    TokenListener,
    BlacklistRepository,
  ],
})
export class AuthModule {}
