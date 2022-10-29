import { Request, Response, NextFunction } from 'express';
import LeaderBoard from '../services/LeaderBoard.services';

export default class BoardCtl {
  private readonly services: LeaderBoard;

  constructor() {
    this.services = new LeaderBoard();
  }

  async main(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const scores = await this.services.fullBoard();
      return res.status(200).json(scores);
    } catch (e) {
      next(e);
    }
  }

  async home(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const scores = await this.services.homeBoard();
      return res.status(200).json(scores);
    } catch (e) {
      next(e);
    }
  }

  async away(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const scores = await this.services.awayBoard();
      return res.status(200).json(scores);
    } catch (e) {
      next(e);
    }
  }
}
