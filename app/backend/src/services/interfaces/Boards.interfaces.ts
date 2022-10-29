export interface IScoreBoard {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: string;
}

export interface IBoardServices {
  fullBoard(): Promise<IScoreBoard[] | void>;
  homeBoard(): Promise<IScoreBoard[] | void>;
  awayBoard(): Promise<IScoreBoard[] | void>;
}
