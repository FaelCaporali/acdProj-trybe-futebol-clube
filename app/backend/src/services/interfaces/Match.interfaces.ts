export type TMatchQuery = {
  inProgress: boolean;
} | Record<string, never>;

type MatchStatus = {
  message: 'Finished' | 'Scheduled' | 'Started',
};
export interface IMatchService {
  matches(query?: TMatchQuery): Promise<IMatch[] | undefined>;
  scheduleMatch(match: IMatchSchedule): Promise< MatchStatus | undefined>
  startWhistle(match: IMatchRequest): Promise< IDBMatch | undefined>;
  finishWhistle(id: number): Promise< MatchStatus | undefined>;
  score(scoreToSet: IScore): Promise<IDBMatch | undefined>;
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
  inProgress: boolean;
}
export interface IDBMatch extends IMatchRequest {
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
