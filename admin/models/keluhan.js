import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Keluhan = sequelize.define('keluhan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING, allowNull: false },
  nik: { type: DataTypes.STRING, allowNull: false },
  nop: { type: DataTypes.STRING, allowNull: false },
  jenis_pajak: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  isi_keluhan: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'keluhan',
  timestamps: false
})

export default Keluhan