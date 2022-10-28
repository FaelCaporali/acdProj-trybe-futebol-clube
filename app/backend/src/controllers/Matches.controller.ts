import { NextFunction, Request, Response } from 'express';
import { IDBMatch, TMatchQuery } from '../services/interfaces/Match.interfaces';
import MatchServices from '../services/Matches.services';

export default class MatchCtl {
  private readonly services: MatchServices;
  constructor() {
    this.services = new MatchServices();
  }

  async newMatch(
    { body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      let match: IDBMatch | undefined;
      if (body.inProgress) {
        match = await this.services.scheduleMatch(body);
      } else {
        match = await this.services.startWhistle(body);
      }
      return res.status(201).json(match);
    } catch (e) {
      next(e);
    }
  }

  async getMatches(
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
