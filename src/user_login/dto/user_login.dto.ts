import { IsBoolean, IsNumber, IsString } from '@nestjs/class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class UserLoginDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  refresh_token: string;

  @ApiProperty()
  @IsString()
  access_token: string;
}
