import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLoginRepository } from '../user_login/user_login.repository';
import { JwtService } from '@nestjs/jwt';
import { UserLoginEntity } from 'src/user_login/user_login.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLoginRepository, UserRepository, UserEntity]),
  ],
  controllers: [],
  providers: [UserLoginRepository, JwtService, UserRepository],
  exports: [],
})
export class UserLoginModule {}
