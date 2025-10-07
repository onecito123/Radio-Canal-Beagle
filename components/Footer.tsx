import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-gray-700 text-text-muted mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-text-main mb-2">Radio Canal Beagle</h3>
            <p>Tu canal de encuentro, Radio Canal Beagle 95.5 FM</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main mb-2">Contacto</h3>
            <p>Email: <a href="mailto:radiocanalbeagle@gmail.com" className="hover:text-primary">radiocanalbeagle@gmail.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/56958217555" target="_blank" rel="noopener noreferrer" className="hover:text-primary">+56 9 5821 7555</a></p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main mb-2">Síguenos</h3>
            <div className="flex justify-center md:justify-start space-x-6">
              <a href="https://www.facebook.com/share/17FBEcBQtF/" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-110" aria-label="Facebook">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/32px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook" className="h-8 w-8" />
              </a>
              <a href="https://www.instagram.com/radiocanalbeagle?igsh=bG05ZjF5OXdyaXdz" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-110" aria-label="Instagram">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/32px-Instagram_icon.png" alt="Instagram" className="h-8 w-8" />
              </a>
              <a href="https://wa.me/56958217555" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-110" aria-label="WhatsApp">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/32px-WhatsApp.svg.png" alt="WhatsApp" className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-base">&copy; 2025 Radio Canal Beagle. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;