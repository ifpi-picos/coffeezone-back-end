import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export function encryptPassword (password: string): string {
  const passwordEncrypted = bcrypt.hashSync(password, 10)
  return passwordEncrypted;
}

export function genToken (user: User) {
  const token = jwt.sign({ id: user.id }, `${process.env.JWT_KEY}`, { expiresIn: '7d' });
  return token;
}