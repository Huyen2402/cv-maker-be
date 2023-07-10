import { IsBoolean, IsNumber, IsString } from '@nestjs/class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsBoolean()
  isDeleted: string;
}

export class UserLoginDTO extends PickType(UserDTO, [
  'email',
  'password',
] as const) {}
