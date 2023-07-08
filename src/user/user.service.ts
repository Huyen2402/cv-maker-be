import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(email: string, password: string) {
    const hash = await bcrypt.hashSync(password, 9);
    console.log(hash);
    const emailFound = await this.userRepository.findOneByEmailAndPassword(
      email,
      hash,
    );
    if (!emailFound) {
      return { status: 404, body: { message: 'Email not found!' } };
    }
    return { status: 200, body: { message: 'Success!' } };
  }
} 
