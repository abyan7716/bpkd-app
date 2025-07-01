import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import PajakPBB from './pajak_pbb.js' // pastikan kamu sudah punya file ini

const HashVerifikasi = sequelize.define('hash_verifikasi', {
  hash: {
    type: DataTypes.TEXT,
    primaryKey: true,
  },
  nik: {
    type: DataTypes.TEXT,
  },
  nop: {
    type: DataTypes.TEXT,
    references: {
      model: PajakPBB,
      key: 'nop',
    },
  },
  dibuat_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
})

HashVerifikasi.belongsTo(PajakPBB, { foreignKey: 'nop', targetKey: 'nop' })
PajakPBB.hasMany(HashVerifikasi, { foreignKey: 'nop', sourceKey: 'nop' })

export default HashVerifikasi
