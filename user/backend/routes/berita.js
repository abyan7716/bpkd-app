const express = require('express');
const router = express.Router();
const db = require('../db'); // koneksi PostgreSQL Pool

// GET semua berita
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id, judul, isi, penulis, tanggal_publikasi, gambar 
      FROM "Berita"
      ORDER BY tanggal_publikasi DESC
    `);

    // Tambahkan prefix URL ke field gambar
    const berita = result.rows.map(item => ({
      ...item,
      gambar: item.gambar ? `http://localhost:3000/uploads/${item.gambar}` : null
    }));

    res.json(berita);
  } catch (err) {
    console.error('Gagal mengambil berita:', err);
    res.status(500).json({ error: 'Gagal mengambil data berita' });
  }
});

// GET detail berita berdasarkan ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT 
        id, judul, isi, penulis, tanggal_publikasi, gambar 
      FROM "Berita" 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    const berita = result.rows[0];
    // Tambahkan prefix URL ke gambar jika ada
    berita.gambar = berita.gambar ? `http://localhost:3000/uploads/${berita.gambar}` : null;

    res.json(berita);
  } catch (err) {
    console.error('Gagal mengambil detail berita:', err);
    res.status(500).json({ error: 'Gagal mengambil data detail berita' });
  }
});

module.exports = router;
