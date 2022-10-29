import { NextFunction, Request, Response } from 'express';
import { TMatchQuery } from '../services/interfaces/Match.interfaces';
import MatchServices from '../services/Matches.services';

export default class MatchCtl {
  private readonly services: MatchServices;
  constructor() {
    this.services = new MatchServices();
  }

  async scoreGoal(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const response = await this.services.score(req.body, req.params.id);
      return res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async newMatch(
    { body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const match = await this.services.postMatchHandler(body);
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

  async finishMatch(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      return res.status(200).json(await this.services.finishWhistle(Number(req.params.id)));
    } catch (e) {
      next(e);
    }
  }
}
