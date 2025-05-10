import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/db';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  birthDate: Date;
  role: 'user' | 'admin';
  createdAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare middleName: string;
  declare email: string;
  declare password: string;
  declare gender: 'male' | 'female' | 'other';
  declare birthDate: Date;
  declare role: 'user' | 'admin';
  declare readonly createdAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
      validate: {
        isIn: [['male', 'female', 'other']],
      },
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString(),
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
  },
);

export default User;
