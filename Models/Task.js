import { Model, DataTypes } from 'sequelize';
import db from '../services/db';

class Task extends Model {

}

Task.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'todo',
  },
  position: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  sequelize: db,
  tableName: 'task',
  modelName: 'task',
});

export default Task;
