import { NextFunction, Request, Response } from 'express';
import MatchServices from '../services/Matches.services';

export default class MatchCtl {
  private readonly services: MatchServices;
  constructor() {
    this.services = new MatchServices();
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const matches = await this.services.findAll();
      return res.status(200).json(matches);
    } catch (e) {
      next(e);
    }
  }
}
