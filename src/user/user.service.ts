import { _ } from 'lodash';
import { UserRepository } from '../user/user.repository';
import { UserLoginRepository } from '../user_login/user_login.repository';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { debug } from 'console';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwt: JwtService,
    private readonly userLoginRepository: UserLoginRepository,
  ) {}

  async login(email: string, password: string) {
    const emailFound = await this.userRepository.checkEmailExist(email);
    if (_.isNil(emailFound)) {
      return { status: 404, body: { message: 'Email not found!' } };
    }
    const saltOrRounds = 9;
    const hash = await bcrypt.hash(password, saltOrRounds);
    debug('hash: ', hash);
    const match = await bcrypt.compare(password, emailFound.password);
    console.log(match);
    if (!match) {
      return { status: 404, body: { message: 'Email not found!' } };
    }

    const userFakeData = {
      _id: emailFound.id,
      name: emailFound.fullName,
      email: email,
    };

    const accessToken = await this.generateToken(
      userFakeData,
      '12345aA!#',
      process.env.ACCESS_TOKEN_LIFE,
    );

    const refreshToken = await this.generateToken(
      userFakeData,
      '12345aA!#',
      process.env.REFRESH_TOKEN_LIFE,
    );

    const bodyUser = {
      refresh_token: refreshToken,
      access_token: accessToken,
      user: emailFound,
      userId: emailFound.id,
    };
    await this.userLoginRepository.createUserLogin(bodyUser);

    return {
      status: 200,
      body: {
        Email: email,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
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

  async refreshToken(refreshToken: string) {
    const userLoginFound = await this.userLoginRepository.checkRefreshToken(
      refreshToken,
    );
    if (!userLoginFound) {
      return { status: 403, body: { message: 'Invalid refresh token.' } };
    }

    if (userLoginFound.isUsed) {
      await this.userLoginRepository.deleteByUser(userLoginFound.userId);
      return { status: 403, body: { message: 'Invalid refresh token.' } };
    }
    await this.userLoginRepository.updateIsUsedById(userLoginFound.id);

    if (!_.isNil(userLoginFound)) {
      try {
        const decoded = await this.verifyToken(
          userLoginFound.refresh_token,
          '12345aA!#',
        );

        const userFakeData = decoded.data;
        const accessToken = await this.generateToken(
          userFakeData,
          '12345aA!#',
          process.env.ACCESS_TOKEN_LIFE,
        );

        const refreshToken = await this.generateToken(
          userFakeData,
          '12345aA!#',
          process.env.REFRESH_TOKEN_LIFE,
        );

        const bodyUser = {
          refresh_token: refreshToken,
          access_token: accessToken,
          userId: userLoginFound.userId,
        };

        await this.userLoginRepository.createUserLogin(bodyUser);

        return {
          status: 200,
          body: {
            Email: userFakeData.email,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        };
      } catch (error) {
        return { status: 403, body: { message: 'Invalid refresh token.' } };
      }
    } else {
      return { status: 403, body: { message: 'No token provided.' } };
    }
  }

  async verifyToken(token, secretKey) {
    return await this.jwt.verifyAsync(token, {
      secret: secretKey,
    });
  }

  async decodeToken(token) {
    return await this.jwt.decode(token);
  }
}
