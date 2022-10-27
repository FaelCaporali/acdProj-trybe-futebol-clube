import { NextFunction, Request, Response } from 'express';
import { IAuthServices, IToken } from '../interfaces';

export default class AuthCtl {
  constructor(private readonly services: IAuthServices) {
    this.services = services;
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
}
