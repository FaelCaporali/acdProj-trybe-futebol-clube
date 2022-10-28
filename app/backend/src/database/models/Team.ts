import { Model, INTEGER, STRING } from 'sequelize';
import { TeamAttributes, TeamCreationAttributes } from './types/Team';
import db from '.';

class Team extends Model<TeamAttributes, TeamCreationAttributes> {
  declare readonly id?: number;
  declare teamName: string;
}

Team.init({
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: STRING(255),
    unique: true,
    allowNull: false,
    field: 'team_name',
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'Team',
  timestamps: false,
});

export default Team;
