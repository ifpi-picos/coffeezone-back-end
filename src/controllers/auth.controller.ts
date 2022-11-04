import { searchByEmail } from '../services/user.service';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthController {

  async userExist(email: string) {
    const user: User | null = await searchByEmail(email);
    return user;
  }

  verifyPasswordLogin(password: string, user: User): boolean {
    const equalPassword = compareSync(password, user.password);
    return equalPassword;
  }

}
