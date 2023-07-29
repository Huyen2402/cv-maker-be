import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class TemplateDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  isDeleted: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class TemplateCreateDTO extends PickType(TemplateDTO, [
  'title',
] as const) {}

export class TemplateUpdateDTO extends TemplateCreateDTO {}
