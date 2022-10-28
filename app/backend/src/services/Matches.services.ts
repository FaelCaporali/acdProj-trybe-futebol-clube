import { Op } from 'sequelize';
import Match from '../database/models/Match';
import Team from '../database/models/Team';
import {
  IDBMatch, TMatchQuery, IMatchRequest, IMatchSchedule, IMatchService, IScore,
} from './interfaces/Match.interfaces';

const NOT_IMPLEMENTED = new Error('Method not implemented.');

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

  async scheduleMatch(_match: IMatchSchedule): Promise<{ message: 'Scheduled' } | undefined> {
    console.log(this.matches({}));
    throw NOT_IMPLEMENTED;
  }

  async startWhistle(match: IMatchRequest): Promise<IDBMatch | undefined> {
    return await this.model.create({ ...match, inProgress: true }) as IDBMatch;
  }

  async finishWhistle(_id: number): Promise<{ message: 'Finished'; } | undefined> {
    console.log(this.matches({}));
    throw NOT_IMPLEMENTED;
  }

  async score(_scoreToSet: IScore): Promise<IDBMatch | undefined> {
    console.log(this.matches({}));
    throw NOT_IMPLEMENTED;
  }
}
