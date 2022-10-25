export interface IToken { token: string }

export interface IRole { role: 'admin' | 'user' | 'unauthorized' }

export interface PublicInfo {
  username: string;
  email: string;
}

export interface ILogRequest {
  email: string;
  password: string;
}

export interface INewUser extends PublicInfo {
  passwords: string;
}

export interface IUser extends PublicInfo {
  id: number;
}

export interface IAuthServices {
  validate(token: IToken): IRole;
  login(user: ILogRequest): IToken;
  logout(id: number): void;
}
