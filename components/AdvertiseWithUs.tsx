import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBullhorn, FaChartLine, FaQuoteLeft } from 'react-icons/fa';

const AdvertiseWithUs: React.FC = () => {
    return (
        <section className="w-full mx-auto py-12 px-6 sm:px-12 rounded-2xl shadow-2xl bg-gradient-to-r from-primary via-orange-600 to-danger overflow-hidden">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Columna de texto y CTA */}
                <div className="text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Alcanza a Miles de Oyentes Apasionados.</h2>
                    <p className="text-lg mb-8 opacity-90">Posiciona tu marca frente a una audiencia local y comprometida. Conviértete en parte de la banda sonora de su día a día.</p>
                    
                    <div className="space-y-4 mb-10">
                        <div className="flex items-center">
                            <FaUsers className="text-3xl mr-4 text-orange-200" />
                            <span className="font-semibold text-lg">Conecta con la comunidad local.</span>
                        </div>
                        <div className="flex items-center">
                            <FaBullhorn className="text-3xl mr-4 text-orange-200" />
                            <span className="font-semibold text-lg">Anuncios en audio y banners web.</span>
                        </div>
                        <div className="flex items-center">
                            <FaChartLine className="text-3xl mr-4 text-orange-200" />
                            <span className="font-semibold text-lg">Planes flexibles para todo presupuesto.</span>
                        </div>
                    </div>

                    <Link to="/contact" className="bg-white text-primary font-bold py-4 px-8 rounded-full text-lg transition-transform duration-300 transform hover:scale-105 inline-block shadow-lg">
                        ¡Anúnciate Aquí!
                    </Link>
                </div>

                {/* Columna de testimonios */}
                <div className="hidden md:flex flex-col gap-6">
                    <Testimonial
                        quote="Nuestras ventas aumentaron un 30% desde que empezamos a anunciarnos en la radio. ¡Increíble alcance!"
                        author="Ana Pérez"
                        company="Café del Fin del Mundo"
                    />
                    <Testimonial
                        quote="La mejor inversión publicitaria que hemos hecho. El equipo nos ayudó a crear una campaña efectiva."
                        author="Carlos Gómez"
                        company="Servicios Australes"
                    />
                </div>
            </div>
        </section>
    );
};

const Testimonial: React.FC<{quote: string, author: string, company: string}> = ({ quote, author, company }) => (
    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/30 text-white">
        <FaQuoteLeft className="text-3xl opacity-50 mb-4" />
        <p className="mb-4 italic">"{quote}"</p>
        <p className="font-bold text-right">{author}, <span className="font-normal opacity-80">{company}</span></p>
    </div>
);

export default AdvertiseWithUs;