import { NextFunction, Request, Response } from 'express';
import { IAuthServices } from '../interfaces';

export default class AuthCtl {
  constructor(private readonly services: IAuthServices) {
    this.services = services;
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const token = await this.services.login({ email, password });
      return res.status(200).json(token);
    } catch (e) {
      next(e);
    }
  }
}
