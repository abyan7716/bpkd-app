import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Jadwal = sequelize.define('jadwal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  summary: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT },
  start_time: { type: DataTypes.DATE, allowNull: false },
  end_time: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'jadwal',
  timestamps: false
})

export default Jadwal