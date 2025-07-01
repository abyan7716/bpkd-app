import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const CekPajakPopup = ({ isOpen, onClose }) => {
  const [nik, setNik] = useState('');
  const [nop, setNop] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrDownload, setQrDownload] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    setQrDownload('');
    setPdfUrl('');

    try {
      const response = await axios.get('http://localhost:5000/api/pbb/cek', {
        params: { nik, nop }
      });
      setResult(response.data);

      const pdfRes = await axios.get('http://localhost:5000/api/pajak-pbb/pdf', {
        params: { nik, nop }
      });

      const { qrDownload, pdfUrl } = pdfRes.data;
      setQrDownload(qrDownload);
      setPdfUrl(`http://localhost:5000${pdfUrl}`);
    } catch (err) {
      setError('Data tidak ditemukan atau terjadi kesalahan.');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setNik('');
      setNop('');
      setResult(null);
      setError('');
      setLoading(false);
      setQrDownload('');
      setPdfUrl('');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl flex flex-col relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-zinc-200 font-bold text-purple-700 flex justify-between items-center">
              Cek Pajak PBB
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-purple-700 text-white hover:bg-purple-800 flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-gray-50 text-gray-900 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                  <input
                    type="text"
                    placeholder="Masukkan NIK"
                    className="w-full border border-gray-300 bg-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Objek Pajak (NOP)</label>
                  <input
                    type="text"
                    placeholder="Masukkan NOP"
                    className="w-full border border-gray-300 bg-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                    value={nop}
                    onChange={(e) => setNop(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-700 text-white font-semibold py-3 rounded-lg hover:bg-purple-800 transition"
                >
                  {loading ? 'Memproses...' : 'Cek Pajak'}
                </button>
              </form>

              {error && <p className="text-red-600 text-center">{error}</p>}

              {result && (
                <div className="bg-white border border-purple-100 p-4 rounded-xl shadow-inner text-gray-800">
                  <h3 className="text-lg font-bold mb-2 text-purple-700">Detail Pajak:</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>NOP:</strong> {result.nop}</p>
                    <p><strong>Alamat:</strong> {result.alamat}</p>
                    <p><strong>Luas Tanah:</strong> {result.luas_tanah}</p>
                    <p><strong>NJOP:</strong> {result.njop}</p>
                    <p><strong>Tagihan 2024:</strong> {result.tagihan_2024}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={result.status === 'Lunas' ? 'text-green-600' : 'text-red-600'}>
                        {result.status}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-purple-700">Riwayat:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {result.riwayat.map((item, idx) => (
                        <li key={idx}>
                          Tahun {item.tahun}: {item.jumlah} -{' '}
                          <span className={item.status === 'Lunas' ? 'text-green-600' : 'text-red-600'}>
                            {item.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {qrDownload && (
                    <div className="mt-6 flex flex-col items-center">
                      <h4 className="font-semibold text-purple-700 mb-1">QR Unduh Laporan PDF</h4>
                      <img src={qrDownload} alt="QR Download PDF" className="w-36 h-36" />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Scan QR ini untuk mengunduh dokumen asli dari sistem
                      </p>
                    </div>
                  )}

                  {pdfUrl && (
                    <div className="mt-4 text-center">
                      <a
                        href={pdfUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                      >
                        Unduh PDF Laporan
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CekPajakPopup;
