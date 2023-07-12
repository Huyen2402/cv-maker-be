import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
<<<<<<< HEAD
import { JwtService } from '@nestjs/jwt';
import { UserLoginEntity } from 'src/user_login/user_login.entity';
import { UserLoginRepository } from 'src/user_login/user_login.repository';
=======
>>>>>>> 1f4ac32394b6f94b2776e39532499095daf99511

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
