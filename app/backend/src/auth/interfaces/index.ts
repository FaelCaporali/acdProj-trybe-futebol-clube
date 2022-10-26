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
  password: string;
}

export interface IUser extends PublicInfo {
  id: number;
  role: string;
}
export interface IFullUser extends INewUser {
  id: number;
  role: string;
}

export interface IAuthServices {
  register(user: INewUser): Promise<IUser>;
  validate(token: IToken): Promise<IRole>;
  login(user: ILogRequest): Promise<IToken>;
  logout(id: number): Promise<void>;
}
