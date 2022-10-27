import { NextFunction, Request, Response } from 'express';
import HttpException from '../HttpException';

const httpErrorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const { status, message } = err as HttpException;
  return res.status(status).json({ message });
};

export default httpErrorMiddleware;
