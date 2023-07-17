import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserLoginDTO, UserRefreshTokenDTO } from '../user/dto/user.dto';
import { UserLoginRO } from '../user/ro/user.ro';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: UserLoginRO })
  @Post('/login')
  async create(@Body() user: UserLoginDTO, @Res() res) {
    console.log(user);
    
    const result = await this.userService.login(user.email, user.password);
    return res.status(result.status).json(result.body);
  }
  @Post('/refresh-token')
  async refreshToken(@Body() body: UserRefreshTokenDTO, @Res() res) {
    const result = await this.userService.refreshToken(body.refreshToken);
    return res.status(result.status).json(result.body);
  }
}
