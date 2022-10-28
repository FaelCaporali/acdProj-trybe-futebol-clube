import { Model, INTEGER, STRING } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from './types/User';
import db from '.';

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare readonly id?: number;
  declare email: string;
  declare username: string;
  declare password?: string;
  declare role: string;
}

User.init({
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: STRING(255),
    unique: true,
    allowNull: false,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
  username: {
    type: STRING(255),
    unique: true,
    allowNull: false,
  },
  role: {
    type: STRING(255),
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'User',
  timestamps: false,
});

export default User;
