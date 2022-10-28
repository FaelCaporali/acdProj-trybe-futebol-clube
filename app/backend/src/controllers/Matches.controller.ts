import { NextFunction, Request, Response } from 'express';
import { TMatchQuery } from '../services/interfaces/Match.interfaces';
import MatchServices from '../services/Matches.services';

export default class MatchCtl {
  private readonly services: MatchServices;
  constructor() {
    this.services = new MatchServices();
  }

  async matches(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const payload: unknown = req.query;
      const matches = await this.services.matches(payload as TMatchQuery);
      return res.status(200).json(matches);
    } catch (e) {
      next(e);
    }
  }
}
