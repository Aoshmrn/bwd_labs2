'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const sequelize_1 = require('sequelize');
const db_1 = __importDefault(require('@config/db'));
const user_1 = __importDefault(require('./user'));
class Event extends sequelize_1.Model {
  id;
  title;
  description;
  date;
  category;
  createdBy;
}
Event.init(
  {
    id: {
      type: sequelize_1.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    description: {
      type: sequelize_1.DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: sequelize_1.DataTypes.DATE,
      allowNull: false,
    },
    category: {
      type: sequelize_1.DataTypes.ENUM('концерт', 'лекция', 'выставка'),
      allowNull: true,
    },
    createdBy: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db_1.default,
    modelName: 'Event',
  },
);
Event.belongsTo(user_1.default, { foreignKey: 'createdBy' });
exports.default = Event;
