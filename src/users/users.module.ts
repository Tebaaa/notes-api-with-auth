import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './controllers';
import { UsersService } from './services';
import { User } from './entities';
import { UsersRepository } from './repositories';
import { UserListener } from './listeners';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserListener],
})
export class UsersModule {}
