import Team from '../database/models/Team';
import Match from '../database/models/Match';
import { IScoreBoard } from './interfaces/Boards.interfaces';
import { ITeam, ITeamServices } from './interfaces/Team.interfaces';
import sequelize = require('sequelize');

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
    return team as ITeam;
  }

  async fullBoard() {
    const board = await this.model.findAll({
      attributes: { exclude: ['id'] },
      // include: [{ model: Match, where: { [Op.and]:  } }],
    }) as unknown;
    return board as IScoreBoard[];
  }

  async homeBoard() {
    const matchAtt = ['id', 'awayTeam', 'awayTeamGoals', 'homeTeam', 'homeTeamGoals', 'inProgress'];
    const teamAndMatches = await this.model.findAll({
      group: ['id'],
      attributes: []
      include: [
        {
          model: Match,
          as: 'teamHome',
          attributes: {
            exclude: matchAtt,
          },
        },
      ],
    }) as unknown;
    return teamAndMatches as IScoreBoard[];
  }

  async awayBoard() {
    const board = await this.model.findAll({
      include: [
        { model: Match, as: 'teamAway' },
      ],
    }) as unknown;
    return board as IScoreBoard[];
  }
}
