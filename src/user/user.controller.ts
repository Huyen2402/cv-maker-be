import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserLoginDTO } from '../user/dto/user.dto';
import { UserLoginRO } from '../user/ro/user.ro';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: UserLoginRO })
  @Post('/login')
  async create(@Body() user: UserLoginDTO, @Res() res) {
    const result = await this.userService.login(user.email, user.password);
    return res.status(result.status).json(result.body);
  }
  @Post('/refresh-token')
  async refreshToken(@Body() body: any, @Res() res) {
    const access_token = body.access_token;
    const refresh_token = body.refresh_token;
    const result = await this.userService.refreshToken(
      refresh_token,
      access_token,
    );
    return res.status(result.status).json(result.body);
  }
}
