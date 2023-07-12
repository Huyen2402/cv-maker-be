import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { Injectable } from '@nestjs/common';
import { UserLoginEntity } from './user_login.entity';

@Injectable()
export class UserLoginRepository extends Repository<UserLoginEntity> {
  constructor(private readonly emanager: EntityManager) {
    super(UserLoginEntity, emanager);
  }
  async createUserLogin(user_login: any) {
    const user = new UserLoginEntity();
    user.access_token = user_login.access_token;
    user.refresh_token = user_login.refresh_token;
    user.user = user_login.user;
    return await this.save(user);
  }
}
