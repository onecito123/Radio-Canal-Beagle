import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Song } from '../types';

const NowPlaying: React.FC = () => {
  const { addSongToHistory, setCurrentSong, currentSong } = usePlayer();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const widgetContainer = widgetRef.current;
    if (!widgetContainer) return;

    const processSongUpdate = () => {
        const songElement = widgetContainer.querySelector('.orbILi.a');
        if (songElement && songElement.textContent) {
            const parts = songElement.textContent.split(' - ');
            const artist = parts[0]?.trim() || 'Artista Desconocido';
            const title = parts.slice(1).join(' - ').trim() || 'Título Desconocido';
            
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const fullTime = `${year}-${month}-${day} ${hours}:${minutes}`;

            const newSong: Song = { artist, title, time: fullTime };
            
            // Update global state only if the song has changed to avoid loops
            if (currentSong?.title !== newSong.title || currentSong?.artist !== newSong.artist) {
                setCurrentSong(newSong);
                addSongToHistory(newSong);
            }
        }
    };

    const observer = new MutationObserver(processSongUpdate);

    observer.observe(widgetContainer, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    });
    
    // Check initially in case the widget loads before the observer is attached.
    const initialCheckTimeout = setTimeout(processSongUpdate, 500);

    return () => {
      clearTimeout(initialCheckTimeout);
      observer.disconnect();
    };
  }, [addSongToHistory, setCurrentSong, currentSong]);

  return (
    <div className="max-w-md mx-auto bg-surface p-6 rounded-lg shadow-lg text-center">
        <div ref={widgetRef} id="onlineradiobox-widget" data-id="orb_pl_67d0d991b2d36a24" data-font-color="#EDF2F7" data-use-serv-timezone="true" data-api-type="json"></div>
        
        <div className="mt-4 pt-4 border-t border-gray-700 text-left space-y-1">
            <h3 className="text-xl font-bold text-center mb-3 text-primary">Sonando Ahora</h3>
            <p><span className="font-semibold text-text-muted w-24 inline-block">Artista:</span> {currentSong?.artist || 'Cargando...'}</p>
            <p><span className="font-semibold text-text-muted w-24 inline-block">Título:</span> {currentSong?.title || '...'}</p>
            {currentSong?.time && (
                 <p><span className="font-semibold text-text-muted w-24 inline-block">Actualizado:</span> {currentSong.time.split(' ')[1]}</p>
            )}
        </div>
    </div>
  );
};

export default NowPlaying;