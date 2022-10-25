import { Optional } from 'sequelize';

export type UserAttributes = {
  id: number;
  email: string;
  password: string;
  username: string;
};

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;
