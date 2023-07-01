import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryArchivedDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => (obj[key] === 'false' ? false : true))
  archived: boolean;
}
