import { Model, INTEGER, STRING } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from './types/User';
import db from '.';
// import OtherModel from './OtherModel';

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id?: number;
  declare email: string;
  declare username: string;
  declare password: string;
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
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'User',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

// OtherModel.belongsTo(Example, { foreignKey: 'campoA', as: 'campoEstrangeiroA' });
// OtherModel.belongsTo(Example, { foreignKey: 'campoB', as: 'campoEstrangeiroB' });

// Example.hasMany(OtherModel, { foreignKey: 'campoC', as: 'campoEstrangeiroC' });
// Example.hasMany(OtherModel, { foreignKey: 'campoD', as: 'campoEstrangeiroD' });

export default User;
