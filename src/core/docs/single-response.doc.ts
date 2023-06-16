import { ApiProperty } from '@nestjs/swagger';

export class SingleResponseDoc<T> {
  @ApiProperty()
  data: T;
}
