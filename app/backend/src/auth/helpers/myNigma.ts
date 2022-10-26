import * as Jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { IToken, IUser, IRole } from '../interfaces';
import { INygma } from '../interfaces/Nygma';

const ALGORITHM = 'aes-256-gcm';

export default class MyNygma implements INygma {
  private readonly salt: string;
  private readonly jwt: typeof Jwt;
  private readonly bcrypt: typeof bcrypt;
  private iv: Buffer;
  private key: Buffer;
  private cipher: crypto.Cipher;
  private decipher: crypto.Cipher;
  private userHashed: string | boolean;

  constructor(private readonly jwtSecret: string) {
    this.jwtSecret = jwtSecret;
    this.jwt = Jwt;
    this.bcrypt = bcrypt;
    this.salt = this.bcrypt.genSaltSync(15);
    this.iv = crypto.randomBytes(16);
    this.key = crypto.randomBytes(32);
    this.cipher = crypto.createCipheriv(ALGORITHM, this.key, this.iv);
    this.decipher = crypto.createDecipheriv(ALGORITHM, this.key, this.iv);
    this.userHashed = false;
  }

  hashPassword(password: string): string {
    return this.bcrypt.hashSync(password, this.salt);
  }

  compareHash(password: string, hash: string): boolean {
    return this.bcrypt.compareSync(password, hash);
  }

  generateToken(user: IUser): IToken {
    const token = this.jwt.sign({ payload: this.hashUser(user) }, this.jwtSecret, {
      expiresIn: '15m',
    });
    return { token };
  }

  validateToken({ token }: IToken): IRole | void {
    const { payload } = this.jwt.verify(token, this.jwtSecret) as { payload: string };
    const { role } = this.deHashUser(payload) as IUser;
    return { role } as IRole;
  }

  private hashUser(user: IUser): string {
    const string = JSON.stringify(user);
    this.userHashed = this.cipher.update(string, 'utf8', 'hex');
    this.userHashed += this.cipher.final('hex');
    return this.userHashed;
  }

  private deHashUser(hash: string): IUser {
    const user = this.decipher.update(hash, 'hex', 'utf8');
    const deHUser = JSON.parse(user);
    this.userHashed = false;
    this.iv = crypto.randomBytes(16);
    this.key = crypto.randomBytes(32);
    this.cipher = crypto.createCipheriv(ALGORITHM, this.key, this.iv);
    this.decipher = crypto.createDecipheriv(ALGORITHM, this.key, this.iv);
    return deHUser;
  }
}
