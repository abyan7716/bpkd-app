import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Antrean = sequelize.define('antrean', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  loket: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 3 } },
  nomor_antrean: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Menunggu' },
  mulai_dilayani_at: { type: DataTypes.DATE },
  durasi_estimasi: { type: DataTypes.INTEGER, defaultValue: 10 },
  dibuat_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'antrean',
  timestamps: false
})

export default Antrean
