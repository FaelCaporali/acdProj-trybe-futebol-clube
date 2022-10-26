import User from '../../database/models/User';
import {
  IToken,
  ILogRequest,
  IRole,
  IAuthServices,
  INewUser,
  IUser,
  IFullUser,
} from '../interfaces';
import MyNygma from '../helpers/myNigma';
import 'dotenv/config';

export default class AuthServices implements IAuthServices {
  private readonly model: typeof User;
  private readonly nygma: MyNygma;

  constructor() {
    this.model = User;
    this.nygma = new MyNygma(
      process.env.JWT_SECRET || 'Should have a better secret',
    );
  }

  async register(user: INewUser): Promise<IUser> {
    const newUser = await this.model.create(user);
    return newUser as IUser;
    // throw new Error('Method not implemented.');
  }

  public async validate(_token: IToken): Promise<IRole> {
    const user = await this.model.findByPk(1);
    console.log(user);
    throw new Error('Method not implemented.');
  }

  public async login({ email, password }: ILogRequest): Promise<IToken> {
    const validUser = (await this.model.findOne({
      where: { email },
    })) as IFullUser;

    if (validUser === null) { throw new Error('should create an error handler - email not in db'); }

    if (!this.nygma.compareHash(password, validUser.password)) {
      throw new Error('should create an error handler - wrong password');
    }

    return this.nygma.generateToken(validUser as IUser);
  }

  public async logout(_id: number): Promise<void> {
    const user = await this.model.findByPk(1);
    console.log(user);
    throw new Error('Method not implemented yet.');
  }
}
