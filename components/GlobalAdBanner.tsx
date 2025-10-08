import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Ad } from '../types';
import { FaTimes } from 'react-icons/fa';

interface GlobalAdBannerProps {
    adsData: Ad[];
}

// Constantes para la consistencia del diseño.
const PLAYER_HEIGHT_PX = 88;
const AD_PLAYER_GAP_PX = 2;
const AD_BANNER_HEIGHT_PX = 90;

const GlobalAdBanner: React.FC<GlobalAdBannerProps> = ({ adsData }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [isAdDismissed, setIsAdDismissed] = useState(false);
    const location = useLocation();

    // Efecto para ciclar a través de los anuncios disponibles.
    useEffect(() => {
        if (adsData && adsData.length > 1) {
            const timer = setInterval(() => {
                setCurrentAdIndex(prev => (prev + 1) % adsData.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [adsData]);

    // Reinicia el banner para que vuelva a aparecer cada vez que el usuario navega a una nueva página.
    useEffect(() => {
        setIsAdDismissed(false);
    }, [location.key]);

    if (!adsData || adsData.length === 0 || isAdDismissed) {
        return null;
    }

    const currentAd = adsData[currentAdIndex];
    if (!currentAd) {
        return null;
    }
    
    const adBottomPosition = PLAYER_HEIGHT_PX + AD_PLAYER_GAP_PX;

    return (
        <div 
            className="fixed left-0 right-0 z-40 flex justify-center items-center pointer-events-none"
            style={{ 
                height: `${AD_BANNER_HEIGHT_PX}px`,
                bottom: `${adBottomPosition}px`,
            }}
        >
            <div 
                className="w-full max-w-[728px] h-full p-1 pointer-events-auto relative"
                key={currentAd.id}
            >
                 <a href={currentAd.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img 
                        src={currentAd.image} 
                        alt={currentAd.company} 
                        className="w-full h-full object-cover rounded-md shadow-lg"
                    />
                </a>
                <button
                    onClick={() => setIsAdDismissed(true)}
                    className="absolute top-1 right-1 bg-gray-900/70 text-white rounded-full p-1 leading-none hover:bg-black z-10"
                    aria-label="Cerrar anuncio"
                >
                    <FaTimes size={14} />
                </button>
            </div>
        </div>
    );
};

export default GlobalAdBanner;