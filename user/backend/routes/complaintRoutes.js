// routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');  // Import koneksi ke database

// POST request untuk menyimpan keluhan
router.post('/', async (req, res) => {
  const { nama, nik, nop, jenis_pajak, email, isi_keluhan } = req.body;

  // Log data yang diterima
  console.log('Data keluhan yang diterima:', req.body);

  // Validasi input data
  if (!nama || !nik || !nop || !jenis_pajak || !email || !isi_keluhan) {
    console.log('Data tidak lengkap:', { nama, nik, nop, jenis_pajak, email, isi_keluhan });
    return res.status(400).json({ error: 'Semua field harus diisi!' });
  }

  try {
    const query = `
      INSERT INTO keluhan (nama, nik, nop, jenis_pajak, email, isi_keluhan)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [nama, nik, nop, jenis_pajak, email, isi_keluhan];

    console.log('Query yang akan dijalankan:', query);
    console.log('Values yang akan dimasukkan:', values);

    await pool.query(query, values);

    console.log('Keluhan berhasil disimpan');
    res.status(201).json({ message: 'Keluhan berhasil dikirim!' });
  } catch (error) {
    console.error('Error saat menyimpan keluhan:', error);
    res.status(500).json({ error: 'Gagal menyimpan keluhan', details: error.message });
  }
});

module.exports = router;
