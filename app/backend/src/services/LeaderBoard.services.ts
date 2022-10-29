import { ITeam } from './interfaces/Team.interfaces';
import Team from '../database/models/Team';
import Match from '../database/models/Match';
import HttpException from '../shared/error/HttpException';
import { IDBMatch } from './interfaces/Match.interfaces';
import { IBoardServices, IScoreBoard } from './interfaces/Boards.interfaces';
import {
  board,
  fullBoard,
  sortBoard,
} from './helpers/boardFunctions';

export default class LeaderBoard implements IBoardServices {
  private readonly teams: typeof Team;
  private readonly matches: typeof Match;
  notImplemented: HttpException;

  constructor() {
    this.matches = Match;
    this.teams = Team;
    this.notImplemented = new HttpException(420, 'not implemented');
  }

  async fullBoard() {
    const home = await this.homeBoard() as IScoreBoard[];
    const away = await this.awayBoard() as IScoreBoard[];
    const myBoard = fullBoard(home, away);
    return sortBoard(myBoard);
  }

  async homeBoard() {
    const teams = await this.teams.findAll() as ITeam[];
    const matches = await this.matches.findAll().then((ms) =>
      ms.filter((m) => !m.inProgress)) as IDBMatch[];
    const myBoard = board('homeTeam', matches, teams);
    return sortBoard(myBoard);
  }

  async awayBoard() {
    const teams = await this.teams.findAll() as ITeam[];
    const matches = await this.matches.findAll().then((ms) =>
      ms.filter((m) => !m.inProgress)) as IDBMatch[];
    const myBoard = board('awayTeam', matches, teams);
    return sortBoard(myBoard);
  }
}
