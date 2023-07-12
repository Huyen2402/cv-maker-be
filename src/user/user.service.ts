import { UserRepository } from '../user/user.repository';
import { UserLoginRepository } from '../user_login/user_login.repository';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { _ } from 'lodash';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwt: JwtService,
    private readonly userLoginRepository: UserLoginRepository,
  ) {}

  async login(email: string, password: string) {
    console.log(email);
    console.log(password);
    const hash = await bcrypt.hashSync(password, 9);
    console.log(hash);
    const emailFound = await this.userRepository.checkEmailExist(email);
    console.log('isNill', _.isNil(emailFound));

    console.log(emailFound);

    if (_.isNil(emailFound)) {
      return { status: 404, body: { message: 'Email not found!' } };
    }
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
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE,
    );

    const refreshToken = await this.generateToken(
      userFakeData,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_LIFE,
    );
    const bodyUser = {
      refresh_token: refreshToken,
      access_token: accessToken,
      user: emailFound,
    };
    const newUserLogin = await this.userLoginRepository.createUserLogin(
      bodyUser,
    );
    console.log('newUserLogin', newUserLogin);
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

  async refreshToken(refresh_token: string, access_token: string) {
    const refreshTokenFromClient = refresh_token;
    const tokenList = await this.userLoginRepository.checkToken(access_token);
    console.log('!_.isNil(tokenList)', !_.isNil(tokenList));
    console.log('tokenList', tokenList);
    if (!_.isNil(refreshTokenFromClient) && !_.isNil(tokenList)) {
      try {
        const decoded = await this.verifyToken(
          refreshTokenFromClient,
          process.env.REFRESH_TOKEN_SECRET,
        );
        console.log(decoded);
        const userFakeData = decoded.data;
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
}
