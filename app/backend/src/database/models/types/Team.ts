import { Optional } from 'sequelize';

export type TeamAttributes = {
  id: number;
  teamName: string;
};

export type TeamCreationAttributes = Optional<TeamAttributes, 'id'>;
