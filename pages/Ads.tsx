import React from 'react';
import AdCarousel from '../components/AdCarousel';
import AdvertiseWithUs from '../components/AdvertiseWithUs'; // Importa el nuevo componente
import { Ad } from '../types';

interface AdsProps {
    adsData: Ad[];
}

const Ads: React.FC<AdsProps> = ({ adsData }) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-20">
      
      {/* Nueva sección para atraer anunciantes */}
      <AdvertiseWithUs />

      {/* Sección para mostrar los anuncios actuales en el carrusel */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Nuestros Socios en el Aire</h2>
        <p className="text-text-muted max-w-2xl mx-auto mb-12 text-center">
          Conoce a las empresas que hacen posible nuestra programación. ¡Gracias por su apoyo!
        </p>
        <div className="mb-8">
          <AdCarousel adsData={adsData} />
        </div>
      </section>

       {/* Listado detallado de patrocinadores */}
       <section>
         <h2 className="text-3xl font-bold text-center mb-8">Directorio de Patrocinadores</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adsData.length > 0 ? adsData.map(ad => (
              <div key={ad.id} className="bg-surface p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-primary mb-2">{ad.company}</h3>
                  <p className="text-text-muted mb-4 h-12">{ad.text}</p>
                  <a href={ad.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-text-main hover:underline inline-block mt-4 bg-background py-2 px-4 rounded-full">
                      Visitar Sitio &rarr;
                  </a>
              </div>
          )) : (
            <p className="text-center text-text-muted col-span-full">Actualmente no hay patrocinadores para mostrar.</p>
          )}
         </div>
       </section>
    </div>
  );
};

export default Ads;