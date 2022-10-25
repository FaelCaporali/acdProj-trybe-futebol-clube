// import { } from 'bcryptjs';
import User from '../../database/models/User';
import { IAuthServices, IToken, ILogRequest, IRole } from '../interfaces';

function newToken(_user: ILogRequest): string {
  return 'generate a token';
}

export default class AuthServices implements IAuthServices {
  constructor(private model: typeof User) {}

  validate(token: IToken): IRole {
    throw new Error('Method not implemented.');
  }

  login({ email, password }: ILogRequest): IToken {
    const validateUser = this.model.findOne({ where: { email, password } });
    if (validateUser === null) throw new Error('should create an error handler');
    return { token: newToken({ email, password }) };
  }

  logout(id: number): void {
    throw new Error('Method not implemented.');
  }
}
