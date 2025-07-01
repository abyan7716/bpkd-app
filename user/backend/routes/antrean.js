const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Koneksi database
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// GET semua antrean per loket
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, loket, nomor_antrean, status, mulai_dilayani_at, durasi_estimasi
      FROM antrean
      WHERE status IN ('Menunggu', 'Sedang Dilayani')
      ORDER BY loket ASC, nomor_antrean ASC
    `);    

    // Kelompokkan per loket
    const antreanPerLoket = {
      1: [],
      2: [],
      3: []
    };

    result.rows.forEach(row => {
      if (antreanPerLoket[row.loket]) {
        antreanPerLoket[row.loket].push(row);
      }
    });

    res.json(antreanPerLoket);
  } catch (error) {
    console.error('Error fetching antrean:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST buat menambahkan antrean baru (opsional)
router.post('/', async (req, res) => {
  const { loket } = req.body;

  if (!loket || loket < 1 || loket > 3) {
    return res.status(400).json({ error: 'Loket harus 1, 2, atau 3' });
  }

  try {
    // Cari nomor antrean terakhir di loket itu
    const last = await pool.query(
      'SELECT MAX(nomor_antrean) AS max_nomor FROM antrean WHERE loket = $1',
      [loket]
    );

    const nextNomor = (last.rows[0].max_nomor || 0) + 1;

    // Insert antrean baru
    const insert = await pool.query(
      `INSERT INTO antrean (loket, nomor_antrean, status)
       VALUES ($1, $2, 'Menunggu')
       RETURNING *`,
      [loket, nextNomor]
    );

    res.status(201).json(insert.rows[0]);
  } catch (error) {
    console.error('Error inserting antrean:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
