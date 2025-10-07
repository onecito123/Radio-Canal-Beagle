import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import AdCarousel from '../components/AdCarousel';
import NowPlaying from '../components/NowPlaying';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';
import AdvertiseWithUs from '../components/AdvertiseWithUs';
import { FaPlay, FaNewspaper, FaChevronLeft, FaChevronRight, FaHistory } from 'react-icons/fa';
import { NewsArticle, Ad, Banner } from '../types';

interface HomeProps {
    banner: Banner;
    newsData: NewsArticle[];
    adsData: Ad[];
}

const localImages = [
    { src: 'https://tolkeyenpatagonia-com.b-cdn.net/wp-content/uploads/2016/01/Amanecer-en-el-Canal-Beagle1.jpg', alt: 'Vista del Canal Beagle' },
    { src: 'https://tolkeyenpatagonia-com.b-cdn.net/wp-content/uploads/2016/01/Amanecer-en-el-Canal-Beagle-Tolkeyen-Patagonia-21.jpg', alt: 'Atardecer sobre el Canal Beagle' },
    { src: 'https://tolkeyenpatagonia-com.b-cdn.net/wp-content/uploads/2016/01/Tolkeyen-Patagonia-Lobos-Marinos.jpg', alt: 'Navegando el Canal Beagle' },
    { src: 'https://turismoenushuaia.com/wp-content/uploads/2022/11/DJI_0054-1024x682.jpg', alt: 'Faro Les Éclaireurs' }
];

const Home: React.FC<HomeProps> = ({ banner, newsData, adsData }) => {
  const { setPlaying, songMem } = usePlayer();
  const [currentImage, setCurrentImage] = useState(0);
  const featuredNews = newsData.slice(0, 3);
  const recentHistory = songMem.slice(0, 5);
  const imageSlideInterval = 5000; // 5 segundos

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % localImages.length);
  }, []);

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + localImages.length) % localImages.length);
  };

  // Efecto para el carrusel automático de "Postales de Nuestra Tierra"
  useEffect(() => {
    const interval = setInterval(nextImage, imageSlideInterval);
    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section 
        className="relative text-center bg-cover bg-center py-24 px-6 rounded-lg overflow-hidden shadow-lg" 
        style={{ backgroundImage: `linear-gradient(rgba(26, 32, 44, 0.7), rgba(45, 55, 72, 0.7)), url(${banner.image})`}}
      >
        <h1 className="text-5xl font-bold mb-4">{banner.text}</h1>
        <p className="text-xl mb-8 text-text-muted">Tu canal de encuentro, Radio Canal Beagle 95.5 FM</p>
        <button
          onClick={() => setPlaying(true)}
          className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 transform hover:scale-105 inline-flex items-center"
        >
          <FaPlay className="mr-3"/>
          ¡Escucha Ahora!
        </button>
      </section>

      {/* Publicidad */}
      <section className="mt-8">
        <AdCarousel adsData={adsData} />
      </section>
      
      {/* Banner Secundario */}
      {banner.secondary_banner_visible && banner.secondary_banner_image && (
        <section className="mt-8">
          <ImageWithPlaceholder 
            src={banner.secondary_banner_image} 
            alt="Banner secundario" 
            className="w-full h-auto rounded-lg shadow-lg object-cover" 
          />
        </section>
      )}

      <div className="mt-16 space-y-16">
        {/* Conéctate con la Comunidad */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">¡Conéctate con la Comunidad!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {/* Facebook Card */}
                <a href="https://www.facebook.com/share/17FBEcBQtF/" target="_blank" rel="noopener noreferrer" className="bg-surface p-6 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-2 flex flex-col items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1024px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook Logo" className="h-16 w-16 mb-4" />
                    <p className="font-semibold text-text-main text-lg">Síguenos en Facebook</p>
                </a>
                {/* Instagram Card */}
                <a href="https://www.instagram.com/radiocanalbeagle?igsh=bG05ZjF5OXdyaXdz" target="_blank" rel="noopener noreferrer" className="bg-surface p-6 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-2 flex flex-col items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png" alt="Instagram Logo" className="h-16 w-16 mb-4" />
                    <p className="font-semibold text-text-main text-lg">Míranos en Instagram</p>
                </a>
                {/* Google Play Card */}
                 <a href="https://play.google.com/store/apps/details?id=com.radiocanalbeagle.app" target="_blank" rel="noopener noreferrer" className="bg-surface p-6 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-2 flex flex-col items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_Arrow_logo.svg/1024px-Google_Play_Arrow_logo.svg.png" alt="Google Play Logo" className="h-16 w-16 mb-4" />
                    <p className="font-semibold text-text-main text-lg">Descarga Nuestra App</p>
                </a>
            </div>
        </section>

        {/* Ahora en el Aire & Historial */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center mb-0">Ahora en el Aire</h2>
          <NowPlaying />
          <div className="max-w-md mx-auto">
            {recentHistory.length > 0 ? (
              <div className="bg-surface p-4 rounded-lg shadow-inner">
                <h3 className="text-lg font-semibold text-center mb-3 text-text-muted">Historial Reciente</h3>
                <ul className="space-y-3">
                  {recentHistory.map((song, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold text-text-main">{song.title}</p>
                        <p className="text-text-muted">{song.artist}</p>
                      </div>
                      <time className="text-xs text-text-muted font-mono">{song.time.split(' ')[1]}</time>
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-4 pt-3 border-t border-gray-700">
                  <Link to="/history" className="font-semibold text-primary hover:text-orange-400 text-sm inline-flex items-center">
                    Ver historial completo <FaChevronRight className="ml-1 w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center text-text-muted py-8 px-4 bg-surface rounded-lg shadow-inner">
                  <FaHistory className="mx-auto text-3xl mb-2" />
                  <p>El historial de canciones aparecerá aquí.</p>
                </div>
            )}
          </div>
        </section>
        
        {/* Imágenes de la Zona */}
        <section>
            <h2 className="text-3xl font-bold text-center mb-8">Postales de Nuestra Tierra</h2>
            <div className="relative max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden">
                <div className="relative w-full h-96">
                    {localImages.map((image, index) => (
                        <img 
                            key={index}
                            src={image.src}
                            alt={image.alt}
                            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}
                </div>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/75 transition-colors z-10" aria-label="Imagen anterior">
                    <FaChevronLeft size={24}/>
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/75 transition-colors z-10" aria-label="Siguiente imagen">
                    <FaChevronRight size={24}/>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-background/70 text-white p-4 text-center">
                    <p className="text-lg font-semibold">{localImages[currentImage].alt}</p>

                </div>
            </div>
        </section>

        {/* Noticias Destacadas */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Noticias Destacadas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNews.map(article => (
              <div key={article.id} className="bg-surface rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <ImageWithPlaceholder src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-sm text-text-muted mb-1">{article.date}</p>
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-text-muted mb-4">{article.summary}</p>
                  <Link to={`/news/${article.id}`} className="font-semibold text-primary hover:text-orange-400">Leer más &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
              <Link to="/news" className="bg-danger hover:bg-danger-hover text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition-colors">
                  <FaNewspaper className="mr-2" />
                  Ver Todas las Noticias
              </Link>
          </div>
        </section>

        {/* Anúnciate con nosotros */}
        <section>
          <AdvertiseWithUs />
        </section>
      </div>
    </div>
  );
};

export default Home;