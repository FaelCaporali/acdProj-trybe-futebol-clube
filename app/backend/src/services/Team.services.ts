import HttpException from '../shared/error/HttpException';
import Team from '../database/models/Team';
import { ITeam, ITeamServices } from './interfaces/Team.interfaces';

export default class TeamServices implements ITeamServices {
  private readonly model: typeof Team;

  constructor() {
    this.model = Team;
  }

  async getAll(): Promise<ITeam[]> {
    const teams = await this.model.findAll();
    return teams as ITeam[];
  }

  async findById(id: number): Promise<ITeam> {
    const team = await this.model.findByPk(id);
    if (!team) throw new HttpException(404, 'No team found');
    return team as ITeam;
  }
}
