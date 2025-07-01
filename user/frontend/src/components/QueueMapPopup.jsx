import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import denahGedung from "../assets/denah-bpkd.jpg"; // Ganti sesuai gambar denah

export default function QueueMapPopup({ isOpen, onClose }) {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:5000/api/antrean") // ganti sesuai endpoint kamu
        .then(res => res.json())
        .then(data => setQueues(data))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-[90%] md:w-[700px] max-h-[90vh] rounded-2xl shadow-lg overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center text-purple-700 font-bold">
              Denah Lokasi & Status Antrean
              <button onClick={onClose} className="w-8 h-8 bg-purple-700 text-white rounded-full hover:bg-purple-800 flex items-center justify-center">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4 text-gray-900">
              <img src={denahGedung} alt="Denah Gedung BPKD" className="rounded-xl w-full" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {queues.map((loket, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl shadow border">
                    <h3 className="font-semibold text-purple-700">Loket {loket.loket}</h3>
                    <p>Antrean #{loket.nomor}</p>
                    <p>Estimasi Tunggu: {loket.estimasi}</p>
                  </div>
                ))}
              </div>

              <button className="mt-4 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition">
                Lihat Daftar Antrean
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
