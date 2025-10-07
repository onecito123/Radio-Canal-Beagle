import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Song } from '../types';

interface PlayerContextType {
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  animationActive: boolean;
  setAnimationActive: React.Dispatch<React.SetStateAction<boolean>>;
  showAlbumCover: boolean;
  setShowAlbumCover: React.Dispatch<React.SetStateAction<boolean>>;
  songMem: Song[];
  addSongToHistory: (song: Song) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const initialSongMem: Song[] = [];

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playing, setPlaying] = useState(false);
  const [animationActive, setAnimationActive] = useState(false); // Corresponds to animationactive: 0
  const [showAlbumCover, setShowAlbumCover] = useState(true);
  const [songMem, setSongMem] = useState<Song[]>(initialSongMem);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const addSongToHistory = (song: Song) => {
    setSongMem(prev => {
      // Prevent adding the exact same song consecutively
      if (prev.length > 0 && prev[0].title === song.title && prev[0].artist === song.artist) {
        return prev;
      }
      // Add new song and keep history to a max of 50
      return [song, ...prev].slice(0, 50);
    });
  };

  const value = {
    playing,
    setPlaying,
    animationActive,
    setAnimationActive,
    showAlbumCover,
    setShowAlbumCover,
    songMem,
    addSongToHistory,
    currentSong,
    setCurrentSong,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};