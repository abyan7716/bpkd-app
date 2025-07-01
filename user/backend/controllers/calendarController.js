const pool = require('../db');

// Ambil semua jadwal
async function getJadwal(req, res) {
  try {
    const result = await pool.query('SELECT * FROM jadwal ORDER BY start_time ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Gagal ambil jadwal:', error);
    res.status(500).json({ message: 'Gagal ambil jadwal', error: error.message });
  }
}

module.exports = {
  getJadwal,
};
