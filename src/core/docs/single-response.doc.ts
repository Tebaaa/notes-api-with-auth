import { ApiProperty } from '@nestjs/swagger';

export class SingleResponse<T> {
  @ApiProperty()
  data: T;
}
