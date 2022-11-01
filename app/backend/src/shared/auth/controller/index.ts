import { NextFunction, Request, Response } from 'express';
import { IAuthServices, IToken } from '../interfaces';
import AuthServices from '../service';

class AuthCtl {
  private readonly services: IAuthServices;
  constructor() {
    this.services = new AuthServices();
  }

  public middleware(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    try {
      const { headers: { authorization } } = req;
      const { role } = this.services.validate({ token: authorization } as IToken);
      req.headers.role = role;
      return next();
    } catch (e) {
      next(e);
    }
  }

  public async authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const {
        headers: { authorization: token },
      } = req;
      const role = await this.services.validate({ token } as IToken);
      return res.status(200).json(role);
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const token = await this.services.login({ email, password });
      return res.status(200).json(token);
    } catch (e) {
      next(e);
    }
  }

  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const token = await this.services.register(req.body);
      return res.status(201).json(token);
    } catch (e) {
      next(e);
    }
  }
}

const auth = new AuthCtl();
export default auth;
