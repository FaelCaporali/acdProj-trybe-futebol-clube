import { Op } from 'sequelize';
import Match from '../database/models/Match';
import Team from '../database/models/Team';
import HttpException from '../shared/error/HttpException';
import {
  IDBMatch, TMatchQuery, IMatchRequest, IMatchService, IScore, IMatchSchedule,
} from './interfaces/Match.interfaces';

export default class MatchServices implements IMatchService {
  private readonly model: typeof Match;

  constructor() {
    this.model = Match;
  }

  async matches(query: TMatchQuery) {
    let inProgress: number | { [Op.or]: boolean[] };
    if (query.inProgress === undefined) {
      inProgress = { [Op.or]: [true, false] };
    } else {
      inProgress = query.inProgress === 'true' ? 1 : 0;
    }

    return await this.model.findAll({
      where: { inProgress },
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
      attributes: { exclude: ['teamHomeId', 'teamAwayId'] },
    }) as Match[];
  }

  async postMatchHandler(match: IMatchSchedule): Promise<IDBMatch | undefined> {
    const homeTeam = await this.model.findByPk(match.homeTeam);
    const awayTeam = await this.model.findByPk(match.awayTeam);
    if (!homeTeam || !awayTeam) throw new HttpException(404, 'There is no team with such id!');

    if (homeTeam.id === awayTeam.id) {
      throw new HttpException(422, 'It is not possible to create a match with two equal teams');
    }

    if (match.inProgress === 'false') {
      const newMatch = await this.scheduleMatch(match);
      return newMatch;
    }
    const newMatch = await this.startWhistle(match);
    return newMatch;
  }

  private async scheduleMatch(match: IMatchRequest): Promise<IDBMatch | undefined> {
    return await this.model.create(match) as IDBMatch;
  }

  private async startWhistle(match: IMatchRequest): Promise<IDBMatch | undefined> {
    return await this.model.create({ ...match, inProgress: true }) as IDBMatch;
  }

  async finishWhistle(id: number): Promise<{ message: 'Finished'; } | undefined> {
    const match = await this.model.findByPk(id);
    const update = await this.model.update({ ...match, inProgress: false }, { where: { id } });
    if (update[0] === 1) return { message: 'Finished' };
    throw new HttpException(500, 'Internal server error');
  }

  async score(scoreToSet: IScore, id: string): Promise<IDBMatch | undefined> {
    const _id = Number(id);
    const match = await this.model.findByPk(_id);
    if (match?.inProgress === true) {
      const update = await this.model.update({ ...match, ...scoreToSet }, { where: { id: _id } });
      if (update[0] === 1) {
        const confirm = await this.model.findByPk(_id) as IDBMatch;
        return confirm;
      }
    } else if (match?.inProgress === false) {
      throw new HttpException(422, 'Match has already ended or not started yet');
    }
    throw new HttpException(500, 'Internal server error');
  }
}
