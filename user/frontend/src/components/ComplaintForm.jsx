import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function ComplaintForm({ onClose, isOpen }) {
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [nop, setNop] = useState("");
  const [jenisPajak, setJenisPajak] = useState("Pajak Bumi dan Bangunan (PBB)");
  const [email, setEmail] = useState("");
  const [textValue, setTextValue] = useState("");

  const [toast, setToast] = useState({ message: "", type: "" });

  const handleTextChange = (e) => setTextValue(e.target.value);
  const handleTextareaResize = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000); // auto close in 3s
  };

  const handleSubmit = async () => {
    if (!nama || !nik || !nop || !email || !textValue) {
      showToast("Mohon lengkapi semua kolom.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/keluhan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama, nik, nop,
          jenis_pajak: jenisPajak,
          email,
          isi_keluhan: textValue,
        }),
      });

      if (res.ok) {
        showToast("Keluhan berhasil dikirim!", "success");
        setNama("");
        setNik("");
        setNop("");
        setJenisPajak("Pajak Bumi dan Bangunan (PBB)");
        setEmail("");
        setTextValue("");
        setTimeout(() => onClose(), 1000);
      } else {
        showToast("Gagal mengirim keluhan.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Terjadi kesalahan saat mengirim keluhan.", "error");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            key="form"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white w-[90%] md:w-[600px] max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-200 font-bold text-purple-700 flex justify-between items-center">
              Formulir Keluhan
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-purple-700 text-white hover:bg-purple-800 flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-4 bg-gray-50 text-gray-900 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">NIK</label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomor Objek Pajak (NOP)</label>
                <input
                  type="text"
                  value={nop}
                  onChange={(e) => setNop(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Pajak</label>
                <select
                  value={jenisPajak}
                  onChange={(e) => setJenisPajak(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Pajak Bumi dan Bangunan (PBB)</option>
                  <option>Bea Perolehan Hak atas Tanah dan Bangunan (BPHTB)</option>
                  <option>Pajak Reklame</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Isi Keluhan</label>
                <textarea
                  value={textValue}
                  onChange={handleTextChange}
                  onInput={handleTextareaResize}
                  rows="1"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-hidden"
                ></textarea>
              </div>
            </div>

            <div className="p-3 border-t border-zinc-200 bg-white flex justify-end">
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-700 hover:bg-purple-800 px-6 py-2 rounded-lg text-white font-semibold shadow-sm"
              >
                Kirim Keluhan
              </motion.button>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
              {toast.message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-white z-[99999] ${
                    toast.type === "success" ? "bg-purple-700" : "bg-red-500"
                  }`}
                >
                  {toast.message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
