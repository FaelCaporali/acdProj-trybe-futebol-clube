export interface IMatchService {
  findAll(): Promise<IMatch[] | undefined>;
  findActive(): Promise<IMatch[] | undefined>;
  findFinished(): Promise<IMatch[] | undefined>;
  startWhistle(match: IMatchRequest): Promise<IDBMatch | undefined>;
  finishWhistle(id: number): Promise<{ message: 'Finished' } | undefined>;
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

export interface IDBMatch extends IMatchRequest {
  id?: number;
  inProgress: boolean;
}

export interface IMatch extends IDBMatch {
  teamHome: {
    teamName: string;
  },
  teamAway: {
    teamName: string;
  }
}
