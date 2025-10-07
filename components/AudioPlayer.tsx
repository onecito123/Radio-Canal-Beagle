import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaHistory, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

interface AudioPlayerProps {
  radioURL: string;
}

// Enum para los estados de audio para mejorar la legibilidad y el mantenimiento
type AudioStatus = 'playing' | 'paused' | 'loading' | 'error';

const AudioPlayer: React.FC<AudioPlayerProps> = ({ radioURL }) => {
  const { playing, setPlaying, showAlbumCover, animationActive, songMem, currentSong } = usePlayer();
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [status, setStatus] = useState<AudioStatus>('paused');
  
  // Ref para acceder al HTMLAudioElement directamente
  const audioRef = useRef<HTMLAudioElement>(null);

  // Efecto para sincronizar el estado de reproducción global con el elemento de audio
  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        // El método play() devuelve una promesa.
        // Debemos manejarla para capturar errores como las restricciones de autoplay.
        audioRef.current.play().catch(error => {
          console.error("Error al intentar reproducir el audio:", error);
          setStatus('error');
          setPlaying(false); // Revertir el estado si la reproducción falla
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, setPlaying]);

  // Efecto para manejar el volumen del audio y el estado de silencio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Manejadores para los eventos del elemento de audio
  const handleOnPlaying = () => setStatus('playing');
  const handleOnPause = () => setStatus('paused');
  const handleOnWaiting = () => setStatus('loading');
  const handleOnError = () => {
    setStatus('error');
    console.error("Error en el stream de audio.");
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && muted) {
        setMuted(false);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };
  
  // Función para renderizar el mensaje de estado y el ícono
  const renderStatus = () => {
    switch (status) {
      case 'playing':
        return <span className="text-sm text-green-400">Transmitiendo...</span>;
      case 'paused':
        return <span className="text-sm text-text-muted">Pausado</span>;
      case 'loading':
        return <span className="flex items-center text-sm text-yellow-400"><FaSpinner className="animate-spin mr-2" /> Cargando...</span>;
      case 'error':
        return <span className="flex items-center text-sm text-red-500"><FaExclamationTriangle className="mr-2" /> Error</span>;
      default:
        return <span className="text-sm text-text-muted">Pausado</span>;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface shadow-[0_-5px_15px_rgba(0,0,0,0.2)] z-50 p-3 text-text-main">
      <audio
        ref={audioRef}
        src={radioURL}
        onPlaying={handleOnPlaying}
        onPause={handleOnPause}
        onWaiting={handleOnWaiting}
        onError={handleOnError}
        preload="auto"
      />
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 min-w-0">
          {showAlbumCover && (
            <img 
              src="https://play-lh.googleusercontent.com/kngWBW8qnRCBZoGyKrfX_7yJC0zPi3f-ukWEHSvtAN9MjJtPcvifs1JXyEqLUnLmcRca5lSk3GzLNLtC3V58isk" 
              alt="Logo Radio Canal Beagle" 
              className={`w-16 h-16 rounded-md object-cover transition-opacity duration-500 ${animationActive ? 'opacity-100' : 'opacity-80'}`} 
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-bold text-lg truncate" title={currentSong?.title}>{currentSong?.title || 'Radio Canal Beagle'}</p>
            <p className="text-sm text-text-muted truncate" title={currentSong?.artist}>{currentSong?.artist || 'Sintonizando...'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setPlaying(!playing)} 
            className="text-3xl text-primary hover:text-orange-400 disabled:text-gray-500 disabled:cursor-not-allowed" 
            aria-label={playing ? "Pausar" : "Reproducir"}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? <FaSpinner className="animate-spin" /> : (playing ? <FaPause /> : <FaPlay />)}
          </button>
          <div className="flex items-center space-x-2 w-32">
            <button onClick={toggleMute} aria-label={muted ? "Quitar silencio" : "Silenciar"}>
              {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.05} 
              value={muted ? 0 : volume} 
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        <div className="relative flex items-center space-x-4">
          {renderStatus()}
          <button onClick={() => setShowHistory(!showHistory)} className="text-2xl text-text-muted hover:text-text-main" aria-label="Ver historial de canciones">
            <FaHistory />
          </button>
          {showHistory && (
            <div className="absolute bottom-full right-0 mb-2 w-72 bg-background p-4 rounded-lg shadow-lg border border-gray-700">
              <h4 className="font-bold mb-2 border-b border-gray-600 pb-1">Historial Reciente</h4>
              <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
                {songMem.length > 0 ? (
                  songMem.map((song, index) => (
                    <li key={index}>
                      <p className="font-semibold">{song.title}</p>
                      <p className="text-text-muted text-xs">{song.artist} - <time>{song.time.split(' ')[1]}</time></p>
                    </li>
                  ))
                ) : (
                  <li>No hay historial disponible.</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;