import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import AdCarousel from '../components/AdCarousel';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';
import AdvertiseWithUs from '../components/AdvertiseWithUs';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { FaPlay, FaNewspaper, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Ad, Banner, ParsedArticle } from '../types';

interface HomeProps {
    banner: Banner;
    adsData: Ad[];
    localNewsData: ParsedArticle[];
}

const localImages = [
    { src: 'https://tolkeyenpatagonia-com.b-cdn.net/wp-content/uploads/2016/01/Amanecer-en-el-Canal-Beagle1.jpg', alt: 'Vista del Canal Beagle' },
    { src: 'https://tolkeyenpatagonia-com.b-cdn.net/wp-content/uploads/2016/01/Amanecer-en-el-Canal-Beagle-Tolkeyen-Patagonia-21.jpg', alt: 'Atardecer sobre el Canal Beagle' },
    { src: 'https://tolkeyenpatagonia-com.b-cdn.net/wp-content/uploads/2016/01/Tolkeyen-Patagonia-Lobos-Marinos.jpg', alt: 'Navegando el Canal Beagle' },
    { src: 'https://turismoenushuaia.com/wp-content/uploads/2022/11/DJI_0054-1024x682.jpg', alt: 'Faro Les Éclaireurs' }
];

const Home: React.FC<HomeProps> = ({ banner, adsData, localNewsData }) => {
  const { setPlaying } = usePlayer();
  const [currentImage, setCurrentImage] = useState(0);
  const imageSlideInterval = 5000; // 5 segundos

  // Lógica para obtener las noticias locales destacadas (ahora 6)
  const featuredLocalNews = useMemo(() => {
    // Tomar las primeras 6 noticias, ya que vienen pre-ordenadas por fecha
    return localNewsData.slice(0, 6);
  }, [localNewsData]);

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
        className="relative text-center bg-cover bg-center py-12 sm:py-16 md:py-20 lg:py-24 px-6 rounded-lg overflow-hidden shadow-lg" 
        style={{ backgroundImage: `linear-gradient(rgba(26, 32, 44, 0.7), rgba(45, 55, 72, 0.7)), url(${banner.image})`}}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{banner.text}</h1>
        <p className="text-lg lg:text-xl mb-8 text-text-muted">Tu canal de encuentro, Radio Canal Beagle 95.5 FM</p>
        <button
          onClick={() => setPlaying(true)}
          className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 text-base sm:py-3 sm:px-8 sm:text-lg rounded-full transition-transform duration-300 transform hover:scale-105 inline-flex items-center"
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
            {/* Cambiado a grid-cols-3 y gap responsivo */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
                {/* Facebook Card */}
                <a href="https://www.facebook.com/share/17FBEcBQtF/" target="_blank" rel="noopener noreferrer" className="bg-surface p-4 sm:p-6 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-2 flex flex-col items-center justify-center">
                    {/* Icono y texto responsivos */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1024px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook Logo" className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
                    <p className="font-semibold text-text-main text-sm sm:text-lg text-center">Síguenos en Facebook</p>
                </a>
                {/* Instagram Card */}
                <a href="https://www.instagram.com/radiocanalbeagle?igsh=bG05ZjF5OXdyaXdz" target="_blank" rel="noopener noreferrer" className="bg-surface p-4 sm:p-6 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-2 flex flex-col items-center justify-center">
                    {/* Icono y texto responsivos */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png" alt="Instagram Logo" className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
                    <p className="font-semibold text-text-main text-sm sm:text-lg text-center">Míranos en Instagram</p>
                </a>
                {/* Google Play Card */}
                 <a href="https://play.google.com/store/apps/details?id=com.radiocanalbeagle.app" target="_blank" rel="noopener noreferrer" className="bg-surface p-4 sm:p-6 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-2 flex flex-col items-center justify-center">
                    {/* Icono y texto responsivos */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_Arrow_logo.svg/1024px-Google_Play_Arrow_logo.svg.png" alt="Google Play Logo" className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
                    <p className="font-semibold text-text-main text-sm sm:text-lg text-center">Descarga la App</p>
                </a>
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
            {featuredLocalNews.map(article => (
              <Link
                to={`/local-news-reader`}
                state={{ article }}
                key={article.link}
                className="bg-surface rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300 flex flex-col no-underline text-left"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm text-text-muted mb-1">{article.source} - {article.pubDate.split(' ')[0]}</p>
                  <h3 className="text-xl font-bold mb-2 flex-grow text-text-main">{article.title}</h3>
                  <p className="text-text-muted mb-4">{article.description}</p>
                  <span className="font-semibold text-primary hover:text-orange-400 mt-auto self-start">
                    Ver más &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
              <Link to="/local-news" className="bg-danger hover:bg-danger-hover text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition-colors">
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
      <ScrollToTopButton />
    </div>
  );
};

export default Home;