import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Berita = sequelize.define('Berita', {
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  penulis: {
    type: DataTypes.STRING,
    defaultValue: 'Admin',
  },
  tanggal_publikasi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  gambar: {
    type: DataTypes.STRING, 
  },
})

export default Berita
