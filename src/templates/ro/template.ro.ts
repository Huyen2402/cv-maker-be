import { ApiProperty } from '@nestjs/swagger';

export class TemplateRO {
  @ApiProperty()
  result: {
    id: number;
    name: string;
    image: string;
  }[];
}


