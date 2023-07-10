import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService],
  exports: [UserService],
})
export class UserModule {}
