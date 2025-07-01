import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

const NewsList = () => {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState('right'); // arah geser
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/berita');
        setBerita(res.data);
      } catch (error) {
        console.error('Error fetching berita:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  // Kontrol animasi geser bolak-balik manual tiap 3 detik
  useEffect(() => {
    if (berita.length <= 3) return; // tidak perlu slider jika kurang dari 4

    const maxSlide = berita.length - 3; // jumlah slide maksimal (karena slidesToShow=3)
    const interval = setInterval(() => {
      if (!sliderRef.current) return;

      if (direction === 'right') {
        if (currentSlide >= maxSlide) {
          setDirection('left');
          setCurrentSlide((prev) => prev - 1);
          sliderRef.current.slickGoTo(currentSlide - 1);
        } else {
          setCurrentSlide((prev) => prev + 1);
          sliderRef.current.slickGoTo(currentSlide + 1);
        }
      } else {
        if (currentSlide <= 0) {
          setDirection('right');
          setCurrentSlide((prev) => prev + 1);
          sliderRef.current.slickGoTo(currentSlide + 1);
        } else {
          setCurrentSlide((prev) => prev - 1);
          sliderRef.current.slickGoTo(currentSlide - 1);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide, direction, berita.length]);

  if (loading) return <p className="text-center py-8">Memuat berita...</p>;
  if (berita.length === 0) return <p className="text-center py-8">Belum ada berita tersedia.</p>;

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false, // sembunyikan panah agar custom
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const renderCard = ({ id, judul, isi, penulis, tanggal_publikasi, gambar }) => (
    <div key={id} className="px-2">
      <article
        onClick={() => navigate(`/berita/${id}`)}
        className="cursor-pointer bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full min-h-[420px]"
      >
        {gambar && (
          <img
            src={gambar}
            alt={judul}
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = '/fallback-image.png'; }}
          />
        )}
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="text-lg font-semibold text-violet-700 mb-2">{judul}</h3>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(tanggal_publikasi).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })} &bull; {penulis}
            </p>
          </div>
          <div className="text-gray-700 text-sm line-clamp-3 overflow-hidden" dangerouslySetInnerHTML={{ __html: isi }} />
        </div>
      </article>
    </div>
  );

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 mb-35">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-violet-600 pb-2">
        Berita Terbaru
      </h2>

      {berita.length <= 3 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {berita.map(renderCard)}
        </div>
      ) : (
        <Slider ref={sliderRef} {...settings}>
          {berita.map(renderCard)}
        </Slider>
      )}
    </section>
  );
};

export default NewsList;
