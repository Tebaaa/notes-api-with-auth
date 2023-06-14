import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSourceConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
