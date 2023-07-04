import { ApiProperty } from "@nestjs/swagger";

export class UserLoginRO {
    @ApiProperty()
    email: number

    @ApiProperty()
    accessToken: string

    @ApiProperty()
    refreshToken: string
}