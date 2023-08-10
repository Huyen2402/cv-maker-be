import { ApiProperty } from '@nestjs/swagger';

export class SuccessResRO {
  @ApiProperty()
  result: string;

  @ApiProperty()
  statuscode: number;
}
