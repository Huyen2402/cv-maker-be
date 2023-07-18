import { IsBoolean, IsNumber, IsString } from '@nestjs/class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class TemplateDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsBoolean()
  is_deleted: boolean;
}
