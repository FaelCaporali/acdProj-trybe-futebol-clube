import Team from '../database/models/Team';
import Match from '../database/models/Match';
import HttpException from '../shared/error/HttpException';
import { IDBMatch } from './interfaces/Match.interfaces';
import { ITeam } from './interfaces/Team.interfaces';
import { IBoardServices, IScoreBoard } from './interfaces/Boards.interfaces';
import { homeResults, homeGoals, homePoints, sortBoard } from './helpers/boardFunctions';

export default class LeaderBoard implements IBoardServices {
  private readonly teams: typeof Team;
  private readonly matches: typeof Match;
  notImplemented: HttpException;

  constructor() {
    this.matches = Match;
    this.teams = Team;
    this.notImplemented = new HttpException(420, 'not implemented');
  }

  private async dbM(): Promise<Match[]> {
    const matches = await this.matches.findAll();
    return matches as Match[];
  }

  private async getTeams(): Promise<ITeam[]> {
    const matches = await this.teams.findAll();
    return matches as ITeam[];
  }

  async fullBoard() {
    throw this.notImplemented;
  }

  async homeBoard() {
    const teams = await this.getTeams();
    const matches = await this.dbM().then((ms) => ms.filter((m) => !m.inProgress)) as IDBMatch[];
    const board = teams.reduce((final: IScoreBoard[], team) => {
      const { victories, draws, losses } = homeResults(matches, team);
      const { goalsPro, goalsCounter } = homeGoals(matches, team);
      const modified = { name: team.teamName } as IScoreBoard;
      modified.totalPoints = homePoints(matches, team);
      modified.totalGames = matches.filter((match) => match.homeTeam === team.id).length;
      modified.totalVictories = victories;
      modified.totalDraws = draws;
      modified.totalLosses = losses;
      modified.goalsFavor = goalsPro;
      modified.goalsOwn = goalsCounter;
      modified.goalsBalance = goalsPro - goalsCounter;
      modified.efficiency = ((modified.totalPoints / (modified.totalGames * 3)) * 100).toFixed(2);
      return [...final, modified];
    }, []);
    return sortBoard(board);
  }

  async awayBoard() {
    throw this.notImplemented;
  }
}
