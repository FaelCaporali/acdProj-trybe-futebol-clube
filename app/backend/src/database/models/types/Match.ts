import { Optional } from 'sequelize';

export type MatchAttributes = {
  readonly id?: number;
  homeTeam: number;
  awayTeam: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  inProgress?: boolean;
};

export type MatchCreationAttributes = Optional<MatchAttributes, 'id'>;
