import { useEffect, useState } from 'react';
import denahImage from '../assets/denah.png';
import { motion, AnimatePresence } from 'framer-motion';

const DenahAntrean = ({ isOpen, onClose }) => {
  const [antrean, setAntrean] = useState({});
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let intervalTimer;
    let intervalFetch;

    if (isOpen) {
      fetchAntrean();
      intervalTimer = setInterval(() => setTimer(prev => prev + 1), 1000);
      intervalFetch = setInterval(fetchAntrean, 10000);
    }

    return () => {
      clearInterval(intervalTimer);
      clearInterval(intervalFetch);
    };
  }, [isOpen]);

  const fetchAntrean = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/antrean');
      const data = await response.json();
      setAntrean(data);
    } catch (error) {
      console.error('Gagal memuat data antrean:', error);
    }
  };

  const calculateRemainingTime = (item) => {
    if (item.status !== 'Sedang Dilayani' || !item.mulai_dilayani_at || !item.durasi_estimasi) return null;
    const mulai = new Date(item.mulai_dilayani_at);
    const sekarang = new Date();
    const durasiMs = item.durasi_estimasi * 60 * 1000;
    const selesai = new Date(mulai.getTime() + durasiMs);
    const selisihMs = selesai - sekarang;
    if (selisihMs <= 0) return "Selesai";
    const menit = Math.floor((selisihMs / 1000 / 60) % 60);
    const detik = Math.floor((selisihMs / 1000) % 60);
    return `${menit}m ${detik}s`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sedang Dilayani':
        return <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Sedang Dilayani</span>;
      case 'Menunggu':
        return <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">Menunggu</span>;
      case 'Selesai':
        return <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">Selesai</span>;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative custom-scroll-denah"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="absolute top-4 right-4 bg-purple-700 text-white p-2 rounded-full hover:bg-purple-800"
              onClick={onClose}
            >
              ✖
            </button>

            <div className="p-6">
              <h2 className="text-2xl  text-purple-700 font-bold mb-4 text-center">Denah Lokasi & Status Antrean</h2>

              <div className="bg-gray-100 rounded-lg p-4 mb-6 flex justify-center">
              <img
                src={denahImage}
                alt="Denah Lokasi"
                className="w-full max-w-xs object-contain"
              />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(antrean).map(([loket, daftarAntrean]) => {
                  const sortedAntrean = daftarAntrean.sort((a, b) => {
                    const order = { 'Sedang Dilayani': 1, 'Menunggu': 2, 'Selesai': 3 };
                    return (order[a.status] || 4) - (order[b.status] || 4);
                  });

                  return (
                    <motion.div
                      key={`loket-${loket}`}
                      className="bg-purple-600 p-4 rounded-lg shadow-md text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-xl font-bold mb-4">Loket {loket}</h3>

                      {sortedAntrean.length > 0 ? (
                        sortedAntrean.map((item) => (
                          <div key={item.id} className="bg-white p-3 rounded-lg mb-3 shadow text-center">
                            <p className="text-lg font-semibold text-gray-800 mb-1">
                              Nomor: {item.nomor_antrean}
                            </p>
                            <div className="mb-2">{getStatusBadge(item.status)}</div>
                            {item.status === 'Sedang Dilayani' && (
                              <p className="text-sm text-gray-700">
                                Estimasi selesai:{" "}
                                <span className="font-bold text-purple-700 animate-pulse">
                                  {calculateRemainingTime(item)}
                                </span>
                              </p>
                            )}
                            {item.status === 'Menunggu' && (
                              <p className="text-sm text-gray-600">Menunggu giliran</p>
                            )}
                            {item.status === 'Selesai' && (
                              <p className="text-sm text-gray-500">Sudah selesai</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">Belum ada antrean</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DenahAntrean;
