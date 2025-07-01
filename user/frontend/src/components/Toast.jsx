// components/Toast.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, type, onClose }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-md text-white ${bgColor} z-[99999]`}
        >
          <div className="flex items-center gap-3">
            <span>{message}</span>
            <button onClick={onClose} className="font-bold">×</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
