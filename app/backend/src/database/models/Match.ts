import { Model, INTEGER, BOOLEAN } from 'sequelize';
import { MatchAttributes, MatchCreationAttributes } from './types/Match';
import db from '.';
import Team from './Team';

class Match extends Model<MatchAttributes, MatchCreationAttributes> {
  declare readonly id?: number;
  declare homeTeam: number;
  declare awayTeam: number;
  declare homeTeamGoals: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Match.init({
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: INTEGER,
    allowNull: false,
    field: 'home_team',
    references: { model: Team, key: 'id' },
  },
  homeTeamGoals: {
    type: INTEGER,
    defaultValue: 0,
    field: 'home_team_goals',
  },
  awayTeam: {
    type: INTEGER,
    allowNull: false,
    field: 'away_team',
    references: { model: Team, key: 'id' },
  },
  awayTeamGoals: {
    type: INTEGER,
    defaultValue: 0,
    field: 'away_team_goals',
  },
  inProgress: {
    type: BOOLEAN,
    defaultValue: false,
    field: 'in_progress',
  },
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

Match.belongsTo(Team, { foreignKey: { field: 'home_team' }, as: 'teamHome' });
Match.belongsTo(Team, { foreignKey: { field: 'away_team' }, as: 'teamAway' });

Team.hasMany(Match, { foreignKey: 'id', as: 'teamHome' });
Team.hasMany(Match, { foreignKey: 'id', as: 'teamAway' });

export default Match;
