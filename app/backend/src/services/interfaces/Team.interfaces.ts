export interface ITeam {
  id: number;
  teamName: string;
}

export interface ITeamServices {
  getAll(): Promise<ITeam[]>;
  findById(id: number): Promise<ITeam>;
}
