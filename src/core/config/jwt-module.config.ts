import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const JwtModuleConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
    signOptions: {
      expiresIn: `${configService.get<string>('ACCESS_TOKEN_EXPIRATION')}s`,
    },
    global: true,
  }),
  inject: [ConfigService],
};
