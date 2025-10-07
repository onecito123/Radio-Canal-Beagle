import React from 'react';
import { PodcastEpisode } from '../types';

const podcastsData: PodcastEpisode[] = [
    { id: 1, title: 'El Origen de la Música Pop', description: 'Un viaje a través de las décadas que definieron el pop.', duration: '45 min', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 2, title: 'Leyendas del Rock', description: 'Entrevistas y anécdotas de las bandas más icónicas.', duration: '62 min', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 3, title: 'Sonidos del Futuro: Electrónica', description: 'Explorando los nuevos géneros y artistas de la música electrónica.', duration: '55 min', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];


const Podcasts: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Nuestros Podcasts</h1>
      <div className="space-y-8 max-w-4xl mx-auto">
        {podcastsData.map(episode => (
          <div key={episode.id} className="bg-surface p-6 rounded-lg shadow-lg flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-2">{episode.title}</h2>
                <p className="text-text-muted mb-4">{episode.description}</p>
                <p className="text-sm font-semibold text-primary">{episode.duration}</p>
            </div>
            <div className="w-full sm:w-80 flex-shrink-0">
                {/* Reemplazado ReactPlayer por el elemento de audio nativo de HTML5 */}
                <audio 
                    controls 
                    src={episode.audioUrl} 
                    className="w-full"
                    aria-label={`Reproductor para ${episode.title}`}
                >
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Podcasts;