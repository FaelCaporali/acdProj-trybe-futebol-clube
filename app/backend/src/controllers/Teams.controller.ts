import { NextFunction, Request, Response } from 'express';
import { ITeamServices } from '../interfaces/Team.interfaces';

export default class TeamsCtl {
  constructor(private readonly services: ITeamServices) {
    this.services = services;
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const teams = await this.services.getAll();
      return res.status(200).json(teams);
    } catch (e) {
      next(e);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const team = await this.services.findById(Number(id));
      return res.status(200).json(team);
    } catch (e) {
      next(e);
    }
  }
}
