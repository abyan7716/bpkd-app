import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/berita/${id}`)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;
  if (!news) return <p className="text-center py-10 text-red-500">Berita tidak ditemukan</p>;

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-snug">{news.judul}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Oleh <span className="font-medium">{news.penulis}</span> — {new Date(news.tanggal_publikasi).toLocaleDateString()}
        </p>
        
        {news.gambar && (
          <img
            src={news.gambar}
            alt={news.judul}
            className="w-full h-auto object-cover rounded-xl shadow mb-6"
          />
        )}

        <div
          className="prose max-w-none text-gray-800 prose-headings:text-gray-900 prose-p:leading-relaxed prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: news.isi }}
        />
      </div>
    </div>
  );
};

export default NewsDetail;
