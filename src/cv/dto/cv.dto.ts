import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  isNumber,
  IsJSON,
} from '@nestjs/class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CvDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  job_title: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsBoolean()
  gender: boolean;

  @ApiProperty()
  @IsString()
  certifications: string;

  @ApiProperty()
  @IsString()
  objective: string;

  @ApiProperty()
  @IsString()
  skills: string;

  @ApiProperty()
  @IsString()
  experience: string;

  @ApiProperty()
  @IsString()
  projects: string;

  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsString()
  experince: string;

  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty()
  @IsNumber()
  template_id: number;
}

export class CvAddDTO extends PickType(CvDTO, [
  'name',
  'job_title',
  'phone',
  'address',
  'objective',
  'path',
  'template_id',
  'gender',
  'skills',
  'projects',
  'avatar',
  'userId',
  'certifications',
  'experince'
] as const) {}
