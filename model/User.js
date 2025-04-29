import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: DataTypes.STRING,
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  googleId: DataTypes.STRING,
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
