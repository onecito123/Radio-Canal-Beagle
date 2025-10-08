import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PlayerContextType {
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  animationActive: boolean;
  setAnimationActive: React.Dispatch<React.SetStateAction<boolean>>;
  showAlbumCover: boolean;
  setShowAlbumCover: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playing, setPlaying] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [showAlbumCover, setShowAlbumCover] = useState(true);

  const value = {
    playing,
    setPlaying,
    animationActive,
    setAnimationActive,
    showAlbumCover,
    setShowAlbumCover,
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