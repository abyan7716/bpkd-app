const express = require('express');
const router = express.Router();
const pool = require('../db'); // asumsi kamu pakai db.js di root backend

// Format angka jadi "Rp"
const formatRupiah = (number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

// Endpoint cek pajak berdasarkan NIK dan NOP
router.get('/cek', async (req, res) => {
  const { nik, nop } = req.query;

  if (!nik || !nop) {
    return res.status(400).json({ error: 'NIK dan NOP harus diisi' });
  }

  try {
    // Cek data pajak_pbb
    const { rows: dataPajak } = await pool.query(
      'SELECT * FROM pajak_pbb WHERE nik = $1 AND nop = $2',
      [nik, nop]
    );

    if (dataPajak.length === 0) {
      return res.status(404).json({ error: 'Data pajak tidak ditemukan' });
    }

    const pajak = dataPajak[0];

    // Ambil riwayat pembayaran
    const { rows: riwayat } = await pool.query(
      'SELECT tahun, jumlah, status FROM riwayat_pembayaran_pbb WHERE nop = $1 ORDER BY tahun DESC',
      [nop]
    );

    // Kirim data sesuai format frontend
    res.json({
      nop: pajak.nop,
      alamat: pajak.alamat,
      luas_tanah: `${pajak.luas_tanah} m²`,
      njop: formatRupiah(pajak.njop),
      [`tagihan_${pajak.tahun_terbaru}`]: formatRupiah(pajak.tagihan_terbaru),
      status: pajak.status_terakhir,
      riwayat: riwayat.map((item) => ({
        tahun: item.tahun,
        jumlah: formatRupiah(item.jumlah),
        status: item.status,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan di server' });
  }
});

module.exports = router;
