import { IScoreBoard } from './Boards.interfaces';

export interface ITeam {
  id: number;
  teamName: string;
}

export interface ITeamServices {
  getAll(): Promise<ITeam[]>;
  findById(id: number): Promise<ITeam>;
  fullBoard(): Promise<IScoreBoard[]>;
  homeBoard(): Promise<IScoreBoard[]>;
  awayBoard(): Promise<IScoreBoard[]>;
}
