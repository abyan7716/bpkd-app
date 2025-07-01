import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-violet-700 text-white py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Deskripsi */}
        <div>
          <h1 className="text-2xl font-bold mb-3">BPKD Kota Tebing Tinggi</h1>
          <p className="text-sm max-w-xs">
            Badan Pengelolaan Keuangan Daerah Kota Tebing Tinggi.
            Menyediakan layanan terbaik untuk masyarakat.
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Navigasi</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">Beranda</Link>
            </li>
            <li>
              <Link to="/berita" className="hover:underline">Berita</Link>
            </li>
            <li>
              <Link to="/layanan" className="hover:underline">Layanan</Link>
            </li>
            <li>
              <Link to="/tentang" className="hover:underline">Tentang</Link>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Kontak</h2>
          <address className="not-italic text-sm space-y-2">
            <p>Jl. Jend. Sudirman No.12, Tebing Tinggi</p>
            <p>Telp: (0622) 123456</p>
            <p>Email: <a href="mailto:info@bpkd-tebingtinggi.go.id" className="underline hover:text-gray-300">info@bpkd-tebingtinggi.go.id</a></p>
          </address>
        </div>
      </div>

      <div className="border-t border-violet-500 mt-10 pt-6 text-center text-sm text-violet-200">
        &copy; {new Date().getFullYear()} BPKD Kota Tebing Tinggi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
