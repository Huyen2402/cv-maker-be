import { EntityManager, Repository } from 'typeorm';
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
    user.userId = user_login.userId;
    user.isUsed = false;
    return await this.save(user);
  }

  async checkRefreshToken(refresh_token: string) {
    return await this.findOne({ where: { refresh_token } });
  }

  async deleteByUser(userId: number) {
    return await this.createQueryBuilder('user_login')
      .delete()
      .from(UserLoginEntity)
      .where('user_login.userId = :userId', { userId })
      .execute();
  }

  async updateIsUsedById(id: number) {
    return await this.createQueryBuilder()
      .update(UserLoginEntity)
      .set({ isUsed: true })
      .where('id = :id', { id })
      .execute();
  }

  async findByUserId(userId: number) {
    return await this.findOne({ where: { userId } });
  }
}
