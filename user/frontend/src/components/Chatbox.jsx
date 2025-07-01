import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbox({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setChatHistory([]);
      setMessage("");
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const aiReply = { role: "assistant", content: data.response };
      setChatHistory((prev) => [...prev, aiReply]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Gagal menjawab." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl h-[75vh] bg-white/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-300 bg-white/70 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-purple-700">Chatbot BPKD</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center bg-purple-700 text-white rounded-full hover:bg-purple-800"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white/60">
              {chatHistory.map((chat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl max-w-[80%] ${
                    chat.role === "user"
                      ? "bg-purple-700 ml-auto text-white p-3"
                      : "bg-white text-black px-4 py-3 border border-zinc-200"
                  }`}
                >
                  {chat.role === "user" ? (
                    chat.content
                  ) : (
                    <ReactMarkdown>{chat.content}</ReactMarkdown>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  className="text-zinc-500 italic"
                >
                  Sedang menjawab...
                </motion.div>
              )}
            </div>

            <div className="p-3 border-t border-zinc-300 bg-white/70 flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 bg-white/90 rounded-xl border border-zinc-300 outline-none text-black"
                placeholder="Ketik pertanyaan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-xl"
              >
                Kirim
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
