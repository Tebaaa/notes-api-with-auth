import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { IUser } from '../interfaces';

export class UserDoc implements Partial<IUser> {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  secondName: string;

  @ApiProperty()
  @Expose()
  lastName: string;
}
