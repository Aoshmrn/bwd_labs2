import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/db';
import User from './user';

interface EventAttributes {
  id: number;
  title: string;
  description?: string;
  date: Date;
  category?: 'концерт' | 'лекция' | 'выставка';
  createdBy: number;
}

interface EventCreationAttributes
  extends Optional<EventAttributes, 'id' | 'description' | 'category'> {}

class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  declare id: number;
  declare title: string;
  declare description?: string;
  declare date: Date;
  declare category?: 'концерт' | 'лекция' | 'выставка';
  declare createdBy: number;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('концерт', 'лекция', 'выставка'),
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Event',
  },
);

Event.belongsTo(User, { foreignKey: 'createdBy' });

export default Event;
