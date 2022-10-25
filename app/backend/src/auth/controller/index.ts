import { NextFunction, Request, Response } from 'express';
import AuthServices from '../service';

export default class AuthCtl {
  constructor(private service: AuthServices) { }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = this.service.login({ email, password });
      return res.status(200).json(token);
    } catch (e) {
      next(e);
    }
  }
}
