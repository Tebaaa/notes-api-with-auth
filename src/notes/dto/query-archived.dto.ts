import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryArchivedDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsBoolean()
  archived: boolean;
}
