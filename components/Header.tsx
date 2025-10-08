import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaBars, FaTimes, FaBroadcastTower, FaUser, FaSignOutAlt, FaWhatsapp } from 'react-icons/fa';

interface HeaderProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuth: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const { playing, setPlaying } = usePlayer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
      setIsAuthenticated(false);
      navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programación', path: '/schedule' },
    { name: 'Noticias', path: '/local-news' },
    { name: 'Contacto', path: '/contact' },
  ];

  const linkClass = "text-text-muted hover:text-text-main transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClass = "text-white bg-primary";

  return (
    <header className="bg-surface shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
         <div className="flex items-center">
  <NavLink to="/" className="flex-shrink-0 flex items-center text-text-main text-2xl font-bold">
    <img 
      src="https://play-lh.googleusercontent.com/kngWBW8qnRCBZoGyKrfX_7yJC0zPi3f-ukWEHSvtAN9MjJtPcvifs1JXyEqLUnLmcRca5lSk3GzLNLtC3V58isk" // Reemplaza con el enlace real de tu imagen
      alt="Logo Radio Canal Beagle" 
      className="w-10 h-10 mr-2" // Ajusta el tamaño (w-10 h-10 equivale a 40px x 40px)
    />
    Radio Canal Beagle
  </NavLink>
</div>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name} 
                  to={link.path} 
                  className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
             <button
              onClick={() => setPlaying(!playing)}
              className="flex items-center bg-danger hover:bg-danger-hover text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105"
              aria-label={playing ? "Pausar la radio" : "Escuchar ahora"}
            >
              {playing ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
              {playing ? 'En Vivo' : 'Escucha Ahora'}
            </button>
            <a href="https://wa.me/56958217555" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" className="text-green-500 hover:text-green-400 transition-transform duration-300 transform hover:scale-110">
              <FaWhatsapp size={32} />
            </a>
            {isAuthenticated ? (
                <>
                    <NavLink to="/admin" className="flex items-center bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full">
                        <FaUser className="mr-2" /> Admin
                    </NavLink>
                    <button onClick={handleLogout} className="flex items-center bg-surface hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
                        <FaSignOutAlt className="mr-2" /> Salir
                    </button>
                </>
            ) : (
                <NavLink to="/login" className="flex items-center bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full">
                    <FaUser className="mr-2" /> Login
                </NavLink>
            )}
          </div>
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-text-muted hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
               <NavLink 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `block ${linkClass} ${isActive ? activeLinkClass : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="flex items-center justify-center space-x-4 pt-4">
                <button
                onClick={() => { setPlaying(!playing); setIsMenuOpen(false); }}
                className="flex-grow flex items-center justify-center bg-danger hover:bg-danger-hover text-white font-bold py-2 px-4 rounded-full"
                aria-label={playing ? "Pausar la radio" : "Escuchar ahora"}
                >
                {playing ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                {playing ? 'En Vivo' : 'Escucha Ahora'}
                </button>
                <a href="https://wa.me/56958217555" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" className="text-green-500 hover:text-green-400">
                    <FaWhatsapp size={32} />
                </a>
            </div>
             <div className="mt-4 border-t border-gray-700 pt-4">
                {isAuthenticated ? (
                    <>
                        <NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className="w-full mb-2 flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full">
                            <FaUser className="mr-2" /> Admin
                        </NavLink>
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center bg-surface hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
                           <FaSignOutAlt className="mr-2" /> Salir
                        </button>
                    </>
                ) : (
                    <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full">
                       <FaUser className="mr-2" /> Login
                    </NavLink>
                )}
             </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;