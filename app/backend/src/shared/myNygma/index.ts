import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import HttpException from '../error/HttpException';
import { INygma } from '../auth/interfaces/Nygma';
import { IToken, IUser, IRole } from '../auth/interfaces';

const ALGORITHM = 'aes-128-gcm';

export default class MyNygma implements INygma {
  private readonly salt: string;
  private iv: Buffer;
  private key: Buffer;
  private dHashUsed: boolean;

  constructor(private readonly jwtSecret: string) {
    this.jwtSecret = jwtSecret;
    this.salt = bcrypt.genSaltSync(15);
    this.iv = crypto.randomBytes(16);
    this.key = crypto.randomBytes(16);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.salt);
  }

  compareHash(password: string, hash: string): boolean {
    if (typeof this.dHashUsed === 'function') console.log('dummy');
    return bcrypt.compareSync(password, hash);
  }

  generateToken(user: IUser): IToken {
    const token = jwt.sign({ payload: this.hashUser(user) }, this.jwtSecret, {
      expiresIn: '15m',
    });
    return { token };
  }

  validateToken({ token }: IToken): IRole {
    try {
      const { payload } = jwt.verify(token, this.jwtSecret) as { payload: string };
      const { role } = this.deHashUser(payload);
      return { role } as IRole;
    } catch (e) {
      console.error(e);
      throw new HttpException(401, 'Token must be a valid token');
    }
  }

  private hashUser(user: IUser): string {
    const string = JSON.stringify(user);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, this.iv);
    let cripted = cipher.update(string, 'utf8', 'hex');
    cripted += cipher.final('hex');
    return cripted;
  }

  private deHashUser(hash: string): IUser {
    const deCipher = crypto.createDecipheriv(ALGORITHM, this.key, this.iv);
    const user = deCipher.update(hash, 'hex', 'utf8');
    return JSON.parse(user);
  }
}
