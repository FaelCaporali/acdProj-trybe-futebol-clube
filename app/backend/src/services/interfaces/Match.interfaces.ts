import Match from '../../database/models/Match';

export type TMatchQuery = {
  inProgress: string;
} | Record<string, never>;

type MatchStatus = {
  message: 'Finished' | 'Scheduled' | 'Started',
};
export interface IMatchService {
  matches(query?: TMatchQuery): Promise<IMatch[] | undefined | Match[]>;
  postMatchHandler(match: IMatchSchedule): Promise< IDBMatch | undefined>;
  finishWhistle(id: number): Promise< MatchStatus | undefined>;
  score(scoreToSet: IScore, id: string): Promise<IDBMatch | undefined>;
}

export interface IScore {
  homeTeamGoals: number,
  awayTeamGoals: number,
}

export interface IMatchRequest extends IScore {
  homeTeam: number;
  awayTeam: number;
}

export interface IMatchSchedule extends IMatchRequest {
  inProgress?: 'true' | 'false' | boolean;
}
export interface IDBMatch extends IMatchSchedule {
  id: number;
}

export interface IMatch extends IDBMatch {
  teamHome: {
    teamName: string;
  },
  teamAway: {
    teamName: string;
  }
}
