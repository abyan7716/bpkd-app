const express = require('express');
const cors = require('cors');
const path = require('path'); // Untuk serve gambar dari folder uploads

const chatRoutes = require('./routes/chat');
const complaintRoutes = require('./routes/complaintRoutes');
const antreanRoutes = require('./routes/antrean');
const calendarRoutes = require('./routes/calendarRoutes');
const pbbRoutes = require('./routes/pbb');
const beritaRoutes = require('./routes/berita'); 
const pdfRoutes = require('./routes/pdf');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve folder uploads untuk akses gambar berita
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/chat', chatRoutes);            // Chatbot
app.use('/api/keluhan', complaintRoutes);    // Formulir Keluhan
app.use('/api/antrean', antreanRoutes);      // Data Antrean & Denah
app.use('/api/calendar', calendarRoutes);    // Jadwal Layanan
app.use('/api/pbb', pbbRoutes);              // Cek Pajak PBB
app.use('/api/berita', beritaRoutes); 
app.use('/api', pdfRoutes);
app.use('/pdfs', express.static(path.join(__dirname, 'public/pdfs')));    

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
