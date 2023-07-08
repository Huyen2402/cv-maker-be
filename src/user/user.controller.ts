import {
  Controller,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserLoginDTO } from './dto/user.dto';
import { UserLoginRO } from './ro/user.ro';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: UserLoginRO })
  @Post('/login')
  async create(@Body() user: UserLoginDTO, @Res() res) {
    const result = await this.userService.login(user.email, user.password);
    return res.status(result.status).json(result.body);
  }
}
