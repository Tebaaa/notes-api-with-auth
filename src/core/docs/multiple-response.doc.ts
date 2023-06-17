import { ApiProperty } from '@nestjs/swagger';

import { PaginationDoc } from '.';

export class MultipleResponseDoc<T> {
  @ApiProperty()
  data: T;
  @ApiProperty({ type: () => PaginationDoc })
  pagination?: PaginationDoc;
}
