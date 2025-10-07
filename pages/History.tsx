import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FaHistory } from 'react-icons/fa';

const History: React.FC = () => {
    const { songMem } = usePlayer();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-4">
                <FaHistory /> Historial de Canciones
            </h1>
            {songMem.length > 0 ? (
                <div className="max-w-4xl mx-auto bg-surface shadow-lg rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-700">
                        {songMem.map((song, index) => (
                            <li key={index} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-background transition-colors">
                                <div className="mb-2 sm:mb-0">
                                    <p className="font-bold text-lg text-text-main">{song.title}</p>
                                    <p className="text-text-muted">{song.artist}</p>
                                </div>
                                <time className="text-sm text-text-muted font-mono self-start sm:self-center">{song.time}</time>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center text-text-muted py-16 max-w-2xl mx-auto bg-surface rounded-lg">
                    <FaHistory className="mx-auto text-5xl mb-4" />
                    <p className="text-xl font-semibold">El historial de canciones está vacío.</p>
                    <p>Escucha la radio para empezar a registrar las canciones que suenan.</p>
                </div>
            )}
        </div>
    );
};

export default History;