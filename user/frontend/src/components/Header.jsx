import React from 'react'
import logo from '../assets/logo.png' // pastikan path ini sesuai dengan struktur foldermu

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4 text-sm text-zinc-600 font-medium">
        <img 
          src={logo} 
          alt="Logo Kota Tebing Tinggi" 
          className="w-10 h-10 object-contain"
        />
        <div>
          <span className="block text-zinc-900 font-semibold">
            Badan Pengelolaan Keuangan dan Pendapatan Daerah
          </span>
          <span className="text-xs">Kota Tebing Tinggi</span>
        </div>
      </div>
      <nav className="space-x-6 text-sm font-medium text-zinc-700">
        <a href="#">Beranda</a>
        <a href="#">Tentang</a>
        <a href="#">Layanan</a>
        <a href="#">Kontak</a>
      </nav>
    </header>
  )
}

export default Header
