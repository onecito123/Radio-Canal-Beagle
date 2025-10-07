import React, { useState, useEffect, useCallback } from 'react';
import { Ad } from '../types';
import ImageWithPlaceholder from './ImageWithPlaceholder';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface AdCarouselProps {
    adsData: Ad[];
}

const AdCarousel: React.FC<AdCarouselProps> = ({ adsData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? adsData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % adsData.length);
  }, [adsData.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (adsData.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [nextSlide, adsData.length]);

  if (adsData.length === 0) {
    return null; // No mostrar nada si no hay anuncios
  }

  return (
    <div className="relative w-full h-32 sm:h-48 md:h-64 lg:h-72 group">
      <div className="relative h-full rounded-lg overflow-hidden shadow-2xl">
        {adsData.map((ad, index) => (
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer"
            key={ad.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            aria-hidden={index !== currentIndex}
          >
            <ImageWithPlaceholder src={ad.image} alt={ad.company} className="w-full h-full object-cover" />
          </a>
        ))}
      </div>

      {/* Left Arrow */}
      <button 
        onClick={prevSlide} 
        className="absolute top-1/2 left-3 -translate-y-1/2 z-20 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Anuncio anterior"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={nextSlide} 
        className="absolute top-1/2 right-3 -translate-y-1/2 z-20 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Siguiente anuncio"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center space-x-2">
        {adsData.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Ir al anuncio ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdCarousel;
