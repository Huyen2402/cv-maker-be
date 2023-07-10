import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { BaseService } from 'src/common/base.service';
import { UserLoginRO } from './ro/user.ro';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwt: JwtService,
  ) {
    super();
  }

  async login(email: string, password: string) {
    const emailFound = await this.userRepository.checkEmailExist(email);
    if (!emailFound) {
      return this.formatData(HttpStatus.UNAUTHORIZED, {
        message: 'Email or password is incorrect!',
      });
    }

    const match = await bcrypt.compare(password, emailFound.password);
    if (!match) {
      return this.formatData(HttpStatus.UNAUTHORIZED, {
        message: 'Email or password is incorrect!',
      });
    }

    const userFakeData = {
      _id: emailFound.id,
      name: emailFound.fullName,
      email: email,
    };

    const accessToken = await this.generateToken(
      userFakeData,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE,
    );

    const refreshToken = await this.generateToken(
      userFakeData,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_LIFE,
    );

    const ro: UserLoginRO = plainToClass(UserLoginRO, {
      email,
      accessToken,
      refreshToken,
    });
    return this.formatData(HttpStatus.OK, ro);
  }

  async generateToken(user, secretSignature, tokenLife) {
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = await this.jwt.signAsync(
      {
        data: userData,
      },
      { secret: secretSignature, expiresIn: tokenLife },
    );
    return token;
  }
}
