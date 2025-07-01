import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';

const CalendarView = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [closing, setClosing] = useState(false);

  // Fungsi untuk ambil data jadwal dari backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/calendar/jadwal');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  // Fungsi untuk hapus jadwal berdasarkan id
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus jadwal ini?')) {
      try {
        await axios.delete(`http://localhost:5000/api/calendar/jadwal/${id}`);
        // Refresh data setelah hapus
        fetchEvents();
      } catch (error) {
        console.error('Gagal menghapus jadwal:', error);
        alert('Gagal menghapus jadwal, coba lagi.');
      }
    }
  };

  // Fetch ulang data setiap kali popup dibuka
  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  if (!isOpen && !closing) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  // Cek apakah dua tanggal sama (tahun, bulan, tanggal)
  const sameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Filter event berdasarkan tanggal yang dipilih
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return sameDay(eventDate, selectedDate);
  });

  return (
    <div className={`fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 ${closing ? 'animate-fadeOut' : ''}`}>
      <div className={`bg-white rounded-2xl shadow-2xl p-8 w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto relative custom-scrollbar ${closing ? 'animate-scaleDown' : 'animate-popup'}`}>

        {/* Tombol Close */}
        <button
          className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition"
          onClick={handleClose}
        >
          ✖
        </button>

        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Informasi Jadwal</h2>

        <div className="flex flex-col items-center">
          <Calendar
            className="custom-calendar w-full text-base custom-center-header"
            onClickDay={(value) => setSelectedDate(value)}
            tileClassName={({ date, view }) => {
              const hasEvent = events.some(event => sameDay(new Date(event.start_time), date));
              const isSunday = date.getDay() === 0;
              if (hasEvent) return 'event-day';
              if (isSunday) return 'text-red-500';
              return '';
            }}
            tileContent={({ date, view }) => {
              const matchingEvent = events.find(event => sameDay(new Date(event.start_time), date));
              if (matchingEvent) {
                return (
                  <div className="tooltip">
                    <span className="tooltiptext">{matchingEvent.summary}</span>
                  </div>
                );
              }
              return null;
            }}
          />
        </div>

        <div className="mt-8 w-full">
          <h3 className="text-xl font-semibold text-purple-600 mb-3 text-center">
            Daftar Jadwal untuk {selectedDate.toLocaleDateString()}:
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {filteredEvents.length === 0 ? (
              <li className="text-center">Tidak ada jadwal untuk hari ini.</li>
            ) : (
              filteredEvents.map((event) => (
                <li key={event.id} className="flex justify-between items-center">
                  <span>
                    <strong>{event.summary}</strong> -{' '}
                    {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    className="ml-4 text-red-600 hover:text-red-800 font-semibold"
                    onClick={() => handleDelete(event.id)}
                    title="Hapus Jadwal"
                  >
                    🗑️
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Tambahan Jadwal Layanan */}
        <div className="mt-10 p-6 bg-purple-100 rounded-xl shadow-inner text-purple-700">
          <h3 className="text-xl font-bold mb-4 text-center">Jadwal Layanan</h3>
          <ul className="space-y-2 text-base">
            <li><span className="font-semibold">Layanan Pagi:</span> 08:00 - 12:00</li>
            <li><span className="font-semibold">Istirahat:</span> 12:00 - 13:00</li>
            <li><span className="font-semibold">Layanan Siang:</span> 13:00 - 16:00</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default CalendarView;
