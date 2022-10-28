import Match from '../database/models/Match';
import Team from '../database/models/Team';
import {
  IDBMatch, IMatch, IMatchRequest, IMatchSchedule, IMatchService, IScore,
} from './interfaces/Match.interfaces';

const NOT_IMPLEMENTED = new Error('Method not implemented.');

export default class MatchServices implements IMatchService {
  private readonly model: typeof Match;

  constructor() {
    this.model = Match;
  }

  async findAll() {
    const matches: unknown = await this.model.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
      attributes: { exclude: ['teamHomeId', 'teamAwayId'] },
    });
    return matches as IMatch[];
  }

  async findActive(): Promise<IMatch[] | undefined> {
    console.log(this.findAll());
    throw NOT_IMPLEMENTED;
  }

  async findFinished(): Promise<IMatch[] | undefined> {
    console.log(this.findAll());
    throw NOT_IMPLEMENTED;
  }

  async scheduleMatch(_match: IMatchSchedule): Promise<{ message: 'Scheduled' } | undefined> {
    console.log(this.findAll());
    throw NOT_IMPLEMENTED;
  }

  async startWhistle(_match: IMatchRequest): Promise<IDBMatch | undefined> {
    console.log(this.findAll());
    throw NOT_IMPLEMENTED;
  }

  async finishWhistle(_id: number): Promise<{ message: 'Finished'; } | undefined> {
    console.log(this.findAll());
    throw NOT_IMPLEMENTED;
  }

  async score(_scoreToSet: IScore): Promise<IDBMatch | undefined> {
    console.log(this.findAll());
    throw NOT_IMPLEMENTED;
  }
}
