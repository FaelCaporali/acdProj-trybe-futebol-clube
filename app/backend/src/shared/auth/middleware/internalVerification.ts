import { Request, Response, NextFunction } from 'express';
import HttpException from '../../error/HttpException';

export default function verifyRequest(req: Request, _res: Response, next: NextFunction) {
  if (
    !req.body
    || !req.body.email
    || req.body.email.length === 0
    || !req.body.password
    || req.body.password.length === 0) {
    return next(new HttpException(400, 'All fields must be filled'));
  }
  return next();
}
