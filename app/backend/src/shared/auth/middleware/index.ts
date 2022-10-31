import { Request, Response, NextFunction } from 'express';
import HttpException from '../../error/HttpException';

const HTTP_ERROR = new HttpException(400, 'All fields must be filled');
export default class AuthMiddleware {
  private readonly invalidOrMissingField;
  constructor() {
    this.invalidOrMissingField = HTTP_ERROR;
  }

  logRequest(req: Request, _res: Response, next: NextFunction): void {
    if (
      !req.body
      || !req.body.email
      || req.body.email.length === 0
      || !req.body.password
      || req.body.password.length === 0) {
      return next(this.invalidOrMissingField);
    }
    return next();
  }
}
