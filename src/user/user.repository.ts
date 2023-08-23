import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly emanager: EntityManager) {
    super(UserEntity, emanager);
  }

  async checkEmailExist(email: string) {
    return await this.findOne({ where: { email } });
  }

  async findUserByID(id: number) {
    return await this.findOne({ where: { id } });
  }

  async findOneByEmailAndPassword(email: string, password: string) {
    return await this.findOne({ where: { email, password } });
  }
}
