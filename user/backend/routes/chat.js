const express = require('express');
const router = express.Router(); // <-- Inisialisasi router di sini
const axios = require('axios');
require('dotenv').config();

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Pesan tidak boleh kosong." });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "system",
            content: "Anda adalah asisten AI resmi BPKD Kota Tebing Tinggi. " +
                     "Jawablah HANYA dalam Bahasa Indonesia yang formal. " +
                     "Fokus pada: " +
                     "1. Kebijakan terupdate BPKD Tebing Tinggi 2025 " +
                     "2. Perpajakan daerah (PBB, retribusi, pajak hiburan) " +
                     "3. Laporan keuangan Pemda Tebing Tinggi " +
                     "4. SOP pengelolaan anggaran daerah 2025 " +
                     "5. Aplikasi e-BPKD Tebing Tinggi " +
                     "\n\n**Informasi Terupdate 2025:** " +
                     "- Target PAD Kota Tebing Tinggi 2025: Rp 1,2 triliun " +
                     "- Aplikasi terbaru: 'SIPD Tebing Tinggi' untuk laporan keuangan " +
                     "- Perda No. 5/2025 tentang Penyesuaian Tarif Retribusi " +
                     "- Pelaporan SPT Pajak Daerah melalui e-BPKD (https://bpkd.tebingtinggikota.go.id) " +
                     "\n\nJika pertanyaan di luar topik, respon: " +
                     "'Maaf, saya hanya membantu informasi terkait BPKD dan perpajakan Kota Tebing Tinggi.'"
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Chatbot BPKD Kota Tebing Tinggi",
        },
      }
    );

    const aiMessage = response.data.choices?.[0]?.message?.content || "Maaf, tidak ada respons dari AI.";
    res.json({ response: aiMessage });
  } catch (error) {
    console.error("Error dari OpenRouter:", error.response?.data || error.message);
    res.status(500).json({ error: "Gagal mendapatkan respon dari AI" });
  }
});

module.exports = router; // <-- Ekspor router