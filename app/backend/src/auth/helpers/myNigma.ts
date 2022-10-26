import * as bcrypt from 'bcryptjs';
import * as Jwt from 'jsonwebtoken';
import { IToken, IUser } from '../interfaces';
import { INygma } from '../interfaces/Nygma';

export default class MyNygma implements INygma {
  private readonly salt: string;
  private readonly jwt: typeof Jwt;
  private readonly crypto: typeof bcrypt;

  constructor(private readonly jwtSecret: string) {
    this.jwtSecret = jwtSecret;
    this.crypto = bcrypt;
    this.salt = this.crypto.genSaltSync(10);
    this.jwt = Jwt;
  }

  hashPassword(password: string): string {
    return this.crypto.hashSync(password);
  }

  compareHash(password: string, hash: string): boolean {
    return this.crypto.compareSync(password, hash);
  }

  generateToken(user: IUser): IToken {
    const token = this.jwt.sign(
      { user },
      this.jwtSecret,
      { expiresIn: '0.25h' },
    );
    return { token };
  }

  validateToken({ token }: IToken): { role: 'admin' | 'user' } | void {
    const { user: { role } } = this.jwt.verify(token, this.jwtSecret) as Jwt.JwtPayload;
    return { role };
  }
}
