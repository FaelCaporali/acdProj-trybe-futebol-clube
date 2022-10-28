import { IToken, IUser, IRole } from '.';

export interface INygma {
  hashPassword(password: string): string;
  compareHash(password: string, hash: string): boolean;
  generateToken(user: IUser): IToken;
  validateToken(token: IToken): IRole | void;
}
