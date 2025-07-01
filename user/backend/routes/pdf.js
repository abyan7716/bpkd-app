const express = require('express');
const router = express.Router();
const pool = require('../db');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Endpoint generate PDF pajak PBB + QR keaslian + QR download + simpan hash
router.get('/pajak-pbb/pdf', async (req, res) => {
  const { nik, nop } = req.query;

  if (!nik || !nop) {
    return res.status(400).json({ error: 'NIK dan NOP harus diisi' });
  }

  try {
    // Ambil data pajak
    const { rows: pajakData } = await pool.query(
      'SELECT * FROM pajak_pbb WHERE nik = $1 AND nop = $2',
      [nik, nop]
    );

    if (pajakData.length === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    const pajak = pajakData[0];

    // Ambil riwayat pembayaran
    const { rows: riwayat } = await pool.query(
      'SELECT tahun, jumlah, status FROM riwayat_pembayaran_pbb WHERE nop = $1 ORDER BY tahun DESC',
      [nop]
    );

    // 🔐 Generate hash unik dari data penting
    const isiString = `${pajak.nik}|${pajak.nop}|${pajak.alamat}|${pajak.status_terakhir}|${pajak.tagihan_terbaru}|${pajak.tahun_terbaru}`;
    const hash = crypto.createHash('sha256').update(isiString).digest('hex');

    // 📂 Setup path
    const fileName = `pbb_${nik}_${nop}.pdf`;
    const pdfDir = path.join(__dirname, '../public/pdfs');
    const pdfPath = path.join(pdfDir, fileName);
    fs.mkdirSync(pdfDir, { recursive: true });

    // Mulai PDF
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // ✍️ Isi PDF
    doc.fontSize(20).text('Laporan Pajak PBB', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`NIK: ${pajak.nik}`);
    doc.text(`NOP: ${pajak.nop}`);
    doc.text(`Alamat: ${pajak.alamat}`);
    doc.text(`Luas Tanah: ${pajak.luas_tanah} m²`);
    doc.text(`NJOP: Rp${pajak.njop.toLocaleString('id-ID')}`);
    doc.text(`Tagihan ${pajak.tahun_terbaru}: Rp${pajak.tagihan_terbaru.toLocaleString('id-ID')}`);
    doc.text(`Status Terakhir: ${pajak.status_terakhir}`);
    doc.moveDown();

    doc.text('Riwayat Pembayaran:');
    riwayat.forEach(r => {
      doc.text(`- Tahun ${r.tahun}: Rp${r.jumlah.toLocaleString('id-ID')} (${r.status})`);
    });
    doc.moveDown();

    // 🧾 QR code untuk hash
    const qrHashDataUrl = await QRCode.toDataURL(hash);
    const base64HashData = qrHashDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrHashPath = path.join(pdfDir, `qr_hash_${nik}_${nop}.png`);
    fs.writeFileSync(qrHashPath, base64HashData, 'base64');
    doc.text('QR Tanda Keaslian Dokumen:', { align: 'left' });
    doc.image(qrHashPath, { width: 100, align: 'left' });
    doc.fontSize(10).text(`Hash: ${hash}`, { width: 400 });

    doc.end();

    writeStream.on('finish', async () => {
      try {
        const pdfUrl = `/pdfs/${fileName}`;
        const fullDownloadUrl = `http://localhost:5000${pdfUrl}`;
        const qrDownloadDataUrl = await QRCode.toDataURL(fullDownloadUrl);

        // ✅ Simpan hash ke database (hindari duplikat dengan ON CONFLICT)
        await pool.query(
          'INSERT INTO hash_verifikasi (hash, nik, nop) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [hash, nik, nop]
        );

        res.json({
          message: 'PDF berhasil dibuat',
          pdfUrl,
          hash,
          qrDownload: qrDownloadDataUrl
        });
      } catch (err) {
        console.error('❌ Gagal QR Download / Simpan Hash:', err);
        res.status(500).json({ error: 'Gagal proses akhir PDF' });
      }
    });

  } catch (err) {
    console.error('❌ Gagal generate PDF:', err);
    res.status(500).json({ error: 'Gagal generate PDF' });
  }
});

module.exports = router;
