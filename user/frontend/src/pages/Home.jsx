import { useState } from 'react';
import Header from '../components/Header';
import ServiceMenu from '../components/ServiceMenu';
import NewsList from '../components/NewsList'; // Import komponen berita
import Chatbox from '../components/Chatbox';
import ComplaintForm from '../components/ComplaintForm';
import DenahAntrean from '../components/DenahAntrean';
import CalendarView from '../components/CalendarView';
import CekPajakPopup from '../components/CekPajakPopup';

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showDenahAntrean, setShowDenahAntrean] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCekPajak, setShowCekPajak] = useState(false);

  const handleChatClick = () => setIsChatOpen(true);
  const handleCloseChat = () => setIsChatOpen(false);

  const handleComplaintClick = () => setShowComplaintForm(true);
  const handleCloseComplaintForm = () => setShowComplaintForm(false);

  const handleDenahAntreanClick = () => setShowDenahAntrean(true);
  const handleCloseDenahAntrean = () => setShowDenahAntrean(false);

  const handleCalendarClick = () => setShowCalendar(true);
  const handleCloseCalendar = () => setShowCalendar(false);

  const handleCekPajakClick = () => setShowCekPajak(true);
  const handleCloseCekPajak = () => setShowCekPajak(false);

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden relative">
      {/* Hero Section */}
     <section className="bg-violet-600 text-center py-6 px-4">
  <h1 className="text-base md:text-xl font-semibold text-white mb-2">
    Selamat datang di Portal Layanan Publik Kota Tebing Tinggi
  </h1>
   <p className="text-white text-base md:text-lg font-medium">
    Akses layanan publik dengan mudah dan cepat.
  </p>
</section>



      {/* Service Menu with margin bottom */}
      <div className="mb-16">
        <ServiceMenu
          onChatClick={handleChatClick}
          onComplaintClick={handleComplaintClick}
          onDenahAntreanClick={handleDenahAntreanClick}
          onCalendarClick={handleCalendarClick}
          onCekPajakClick={handleCekPajakClick}
        />
      </div>

      {/* News List */}
      <NewsList />

      {/* Popups */}
      <Chatbox isOpen={isChatOpen} onClose={handleCloseChat} />
      <ComplaintForm isOpen={showComplaintForm} onClose={handleCloseComplaintForm} />
      <DenahAntrean isOpen={showDenahAntrean} onClose={handleCloseDenahAntrean} />
      <CalendarView isOpen={showCalendar} onClose={handleCloseCalendar} />
      <CekPajakPopup isOpen={showCekPajak} onClose={handleCloseCekPajak} />
    </div>
  );
};

export default Home;
