import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthService {
  
  genToken (user: User) {
    const token = jwt.sign({ id: user.id }, `${process.env.JWT_KEY}`, { expiresIn: '7d' });
    return token;
  }

  verifyPasswordLogin(password: string, user: User): boolean {
    const equalPassword = compareSync(password, user.password);
    return equalPassword;
  }

}