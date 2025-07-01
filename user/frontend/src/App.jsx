import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import Header from './components/Header'; // pastikan path sesuai struktur foldermu
import Footer from './components/Footer'; // pastikan path juga benar

function App() {
  return (
    <Router>
      <Header /> {/* Header tampil di semua halaman */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/berita/:id" element={<NewsDetail />} />
      </Routes>

      <Footer /> {/* Footer tampil di semua halaman */}
    </Router>
  );
}

export default App;
  