import { UserRepository } from './user.repository';
import {
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(email: string, password: string) {
    const emailFound = await this.userRepository.checkEmailExist(email);
    if (!emailFound) {
      return { status: 404, body: { message: 'Email not found!' } };
    }
  }
}
