import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  page?: number = 1;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    minimum: 1,
    default: 20,
  })
  items?: number;
}
