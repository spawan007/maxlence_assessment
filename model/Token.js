import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Token = sequelize.define('Token', {
  token: DataTypes.STRING,
  userId: DataTypes.INTEGER,
  expiresAt: DataTypes.DATE,
});
