import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { UserDoc } from '@Users/docs';

import { TokenDoc } from '.';

export class LoginInfoDoc {
  @ApiProperty()
  @Expose()
  @Type(() => UserDoc)
  user: UserDoc;

  @ApiProperty()
  @Expose()
  @Type(() => TokenDoc)
  tokens: TokenDoc;
}
