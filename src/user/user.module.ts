import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { UserLoginEntity } from 'src/user_login/user_login.entity';
import { UserLoginRepository } from 'src/user_login/user_login.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserLoginRepository,
      UserLoginEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserLoginRepository, JwtService],
  exports: [UserService],
})
export class UserModule {}
