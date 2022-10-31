import HttpException from '../../error/HttpException';
import User from '../../../database/models/User';
import {
  IToken,
  ILogRequest,
  IRole,
  IAuthServices,
  INewUser,
  IUser,
  IFullUser,
} from '../interfaces';
import MyNygma from '../../myNygma';
import schema from './validations/schemas';
import 'dotenv/config';

export default class AuthServices implements IAuthServices {
  private readonly model: typeof User;
  private readonly nygma: MyNygma;
  private readonly schemas: typeof schema;

  constructor() {
    this.model = User;
    this.nygma = new MyNygma(
      process.env.JWT_SECRET || 'Should have a better secret',
    );
    this.schemas = schema;
  }

  async register(user: INewUser): Promise<IUser> {
    const newUser = await this.model.create(user);
    return newUser as IUser;
  }

  public async validate(token: IToken): Promise<IRole> {
    if (!token.token) throw new HttpException(400, 'Must provide credentials');
    const userRole = this.nygma.validateToken(token);
    return userRole;
  }

  public async login(credentials: ILogRequest): Promise<IToken> {
    const { error } = this.schemas.validate(credentials);
    if (error) throw new HttpException(401, 'Incorrect email or password');

    const { email, password } = credentials;
    const validUser = await this.model.findOne({
      where: { email },
    }) as IFullUser;
    if (validUser === null
      || !this.nygma.compareHash(password, validUser.password)) {
      throw new HttpException(401, 'Incorrect email or password');
    }

    return this.nygma.generateToken(validUser as IUser);
  }

  public async logout(_id: number): Promise<void> {
    const user = await this.model.findByPk(1);
    console.log(user);
    throw new Error('Method not implemented yet.');
  }
}
