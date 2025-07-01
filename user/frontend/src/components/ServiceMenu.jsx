import {
  FaComments,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaSearch,
} from 'react-icons/fa';

import ilustrasi from '../assets/image.svg'; // import gambar ilustrasi

const ServiceMenu = ({
  onChatClick,
  onComplaintClick,
  onDenahAntreanClick,
  onCalendarClick,
  onCekPajakClick,
}) => {
  return (
    <section className="max-w-6xl mx-auto px-8 py-20 ">
      <div className="bg-gray-100 rounded-3xl shadow-inner p-12 flex flex-col lg:flex-row items-center gap-10">
        {/* Gambar ilustrasi di sebelah kiri */}
        <div className="flex-shrink-0 w-full lg:w-1/2">
          <img
            src={ilustrasi}
            alt="Ilustrasi Layanan"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Tombol-tombol layanan di sebelah kanan */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Tombol chatbot utama */}
          <div className="mb-10">
            <button
              onClick={onChatClick}
              className="w-full flex items-center justify-center gap-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-6 px-8 rounded-2xl text-2xl shadow-lg transition-all duration-200"
            >
              <FaComments className="text-3xl" />
              Chatbot Layanan Pajak
            </button>
          </div>

          {/* Tombol layanan lain 2 kolom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={onComplaintClick}
              className="flex items-center justify-start gap-4 bg-violet-600 hover:bg-violet-700 text-white font-medium py-5 px-6 rounded-xl text-xl shadow-md transition"
            >
              <FaExclamationTriangle className="text-2xl" />
              Kirim Keluhan
            </button>
            <button
              onClick={onDenahAntreanClick}
              className="flex items-center justify-start gap-4 bg-violet-600 hover:bg-violet-700 text-white font-medium py-5 px-6 rounded-xl text-xl shadow-md transition"
            >
              <FaMapMarkedAlt className="text-2xl" />
              Denah & Antrean
            </button>
            <button
              onClick={onCalendarClick}
              className="flex items-center justify-start gap-4 bg-violet-600 hover:bg-violet-700 text-white font-medium py-5 px-6 rounded-xl text-xl shadow-md transition"
            >
              <FaCalendarAlt className="text-2xl" />
              Jadwal Layanan
            </button>
            <button
              onClick={onCekPajakClick}
              className="flex items-center justify-start gap-4 bg-violet-600 hover:bg-violet-700 text-white font-medium py-5 px-6 rounded-xl text-xl shadow-md transition"
            >
              <FaSearch className="text-2xl" />
              Cek Pajak PBB
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceMenu;
