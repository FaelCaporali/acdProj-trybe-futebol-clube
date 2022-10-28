import { NextFunction, Request, Response } from 'express';
import { TMatchQuery } from '../services/interfaces/Match.interfaces';
import MatchServices from '../services/Matches.services';

export default class MatchCtl {
  private readonly services: MatchServices;
  constructor() {
    this.services = new MatchServices();
  }

  async newMatch(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const match = req.body;
      const confirmation = await this.services.startWhistle(match);
      return res.status(201).json(confirmation);
    } catch (e) {
      next(e);
    }
  }

  async matches(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const matches = await this.services.matches(req.query as TMatchQuery);
      return res.status(200).json(matches);
    } catch (e) {
      next(e);
    }
  }
}
