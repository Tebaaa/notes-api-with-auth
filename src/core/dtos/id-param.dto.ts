import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdParamDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}
