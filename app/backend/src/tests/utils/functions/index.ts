import { Request, Response, NextFunction } from 'express';

function middlewareSkipper(req: Request, res: Response, next: NextFunction): void {
  return next();
}

export {
    middlewareSkipper,
};