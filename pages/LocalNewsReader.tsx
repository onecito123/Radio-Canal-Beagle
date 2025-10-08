import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ParsedArticle } from '../types';
import { FaArrowLeft } from 'react-icons/fa';

// Constante para la altura de la cabecera principal.
const MAIN_HEADER_HEIGHT_PX = 80; // h-20 de Header.tsx

// Hook personalizado para detectar cambios en el tamaño de la pantalla.
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const documentChangeHandler = () => setMatches(mediaQueryList.matches);

        try {
            mediaQueryList.addEventListener('change', documentChangeHandler);
        } catch (e) {
            mediaQueryList.addListener(documentChangeHandler); // Fallback obsoleto
        }

        return () => {
            try {
                mediaQueryList.removeEventListener('change', documentChangeHandler);
            } catch (e) {
                mediaQueryList.removeListener(documentChangeHandler); // Fallback obsoleto
            }
        };
    }, [query]);

    return matches;
};


const LocalNewsReader: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const article = location.state?.article as ParsedArticle | undefined;
    
    // Media query para diferenciar móvil de tablet/escritorio.
    const isMobile = useMediaQuery('(max-width: 767px)');

    // Efecto para ocultar el pie de página principal para una experiencia inmersiva.
    useEffect(() => {
        const footerElement = document.querySelector('footer');
        if (footerElement) {
            footerElement.style.display = 'none';
        }
        return () => {
            if (footerElement) {
                footerElement.style.display = 'block';
            }
        };
    }, []);

    if (!article) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">No se encontró la noticia</h1>
                <p className="text-text-muted mb-4">No se pudo cargar la información del artículo.</p>
                <Link to="/local-news" className="inline-flex items-center bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary-hover">
                    <FaArrowLeft className="mr-2" />
                    Volver a Noticias Locales
                </Link>
            </div>
        );
    }

    return (
        <>
            {isMobile ? (
                // Botón de acción flotante para móvil - simple y sutil
                <button
                    onClick={() => navigate(-1)}
                    className="fixed top-24 left-4 bg-surface/80 backdrop-blur-sm text-text-main p-3 rounded-full shadow-lg hover:bg-primary transition-colors z-40"
                    aria-label="Volver a la lista de noticias"
                >
                    <FaArrowLeft size={20} />
                </button>
            ) : (
                // Cabecera de lector dedicada y fija para escritorio
                <div 
                    className="fixed left-0 right-0 bg-surface/80 backdrop-blur-sm shadow-lg z-40 flex items-center justify-between px-4 py-3"
                    style={{ top: `${MAIN_HEADER_HEIGHT_PX}px` }}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-text-main p-2 rounded-full hover:bg-primary transition-colors"
                        aria-label="Volver a la lista de noticias"
                    >
                        <FaArrowLeft className="mr-2" /> Volver
                    </button>
                    <div className="text-right">
                        <p className="font-bold text-sm text-text-main truncate">{article.source}</p>
                        <p className="text-xs text-text-muted">{article.pubDate}</p>
                    </div>
                </div>
            )}
            
            {/* Contenedor del iframe con relleno condicional para la cabecera de escritorio */}
            <div className="max-w-4xl mx-auto" style={{ paddingTop: isMobile ? '0px' : '60px' }}>
                <iframe
                    src={article.link}
                    title={article.title}
                    className="w-full border-none"
                    style={{ height: '5000px' }}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
            </div>
        </>
    );
};

export default LocalNewsReader;
