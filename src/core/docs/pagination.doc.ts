import { ApiProperty } from '@nestjs/swagger';

export class PaginationDoc {
  @ApiProperty()
  total_pages: number | null;

  @ApiProperty()
  items_per_page: number;

  @ApiProperty()
  total_items: number | null;

  @ApiProperty()
  current_page: number;

  @ApiProperty()
  next_page: number | null;

  @ApiProperty()
  previous_page: number | null;
}
