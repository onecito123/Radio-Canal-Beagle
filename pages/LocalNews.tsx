import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSync, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { ParsedArticle } from '../types';

interface LocalNewsProps {
    localNewsData: ParsedArticle[];
    loading: boolean;
    onRefresh: () => void;
}

const rssSources = [
    { name: 'La Prensa Austral' },
    { name: 'El Pingüino' },
    { name: 'El Magallanico' },
];

const dateFilters = [
    { id: 'all', label: 'Todos' },
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Última Semana' },
    { id: 'month', label: 'Último Mes' },
]

const FilterButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 whitespace-nowrap ${
            isActive 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-background text-text-muted hover:bg-gray-700 hover:text-text-main'
        }`}
    >
        {label}
    </button>
);

const LocalNews: React.FC<LocalNewsProps> = ({ localNewsData, loading, onRefresh }) => {
    const [activeSource, setActiveSource] = useState<string>('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');

    const filteredArticles = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);

        return localNewsData
            .filter(article => {
                if (activeSource === 'Todos') return true;
                return article.source === activeSource;
            })
            .filter(article => {
                if (dateFilter === 'all') return true;
                if (dateFilter === 'today') return article.rawDate >= today;
                if (dateFilter === 'week') return article.rawDate >= weekAgo;
                if (dateFilter === 'month') return article.rawDate >= monthAgo;
                return true;
            })
            .filter(article => {
                if (searchTerm.trim() === '') return true;
                const term = searchTerm.toLowerCase();
                return (
                    article.title.toLowerCase().includes(term) ||
                    article.description.toLowerCase().includes(term)
                );
            });
    }, [localNewsData, activeSource, dateFilter, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-center mb-4 sm:mb-0">Noticias Locales</h1>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-500"
                    aria-label="Actualizar noticias"
                >
                    {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaSync className="mr-2" />}
                    {loading ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>

             {/* Filters Section - Simplificado para móviles */}
            <div className="bg-surface p-3 sm:p-4 rounded-lg mb-8 space-y-4">
                <input
                    id="search-input"
                    type="text"
                    placeholder="Buscar en las noticias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-background border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Buscar por palabra"
                />
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Date Filters */}
                    <div className="flex items-center flex-wrap gap-2">
                        <span className="text-sm font-semibold text-text-muted mr-2 hidden sm:inline">Fecha:</span>
                        {dateFilters.map(filter => (
                            <FilterButton 
                                key={filter.id} 
                                label={filter.label} 
                                isActive={dateFilter === filter.id} 
                                onClick={() => setDateFilter(filter.id)} 
                            />
                        ))}
                    </div>
                    {/* Source Filters */}
                    <div className="flex items-center flex-wrap gap-2 pt-4 border-t border-gray-700 md:pt-0 md:border-t-0 md:pl-4 md:border-l">
                         <span className="text-sm font-semibold text-text-muted mr-2 hidden sm:inline">Medio:</span>
                        <FilterButton label="Todos" isActive={activeSource === 'Todos'} onClick={() => setActiveSource('Todos')} />
                        {rssSources.map(feed => (
                            <FilterButton 
                                key={feed.name} 
                                label={feed.name} 
                                isActive={activeSource === feed.name} 
                                onClick={() => setActiveSource(feed.name)} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {loading && localNewsData.length === 0 ? (
                <div className="text-center py-16">
                    <FaSpinner className="animate-spin text-primary text-5xl mx-auto" />
                    <p className="mt-4 text-text-muted">Buscando las últimas noticias...</p>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-8">
                    {filteredArticles.length > 0 ? filteredArticles.map((article, index) => (
                        <article key={`${article.link}-${index}`} className="bg-surface p-4 sm:p-6 rounded-lg shadow-lg flex flex-col">
                            {article.image && (
                                <div className="flex-shrink-0 mb-4">
                                     <Link to="/local-news-reader" state={{ article }}>
                                        <ImageWithPlaceholder
                                            src={article.image}
                                            alt={`Imagen para ${article.title}`}
                                            className="w-full h-64 object-cover rounded-md"
                                        />
                                    </Link>
                                </div>
                            )}
                            <div className="flex flex-col flex-grow">
                                <span className={`text-sm font-bold py-1 px-3 rounded-full self-start mb-2 ${
                                    article.source === 'La Prensa Austral' ? 'bg-blue-600' :
                                    article.source === 'El Pingüino' ? 'bg-red-600' : 'bg-green-600'
                                }`}>
                                    {article.source}
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold mb-2 flex-grow">
                                     <Link to="/local-news-reader" state={{ article }} className="hover:text-primary transition-colors">
                                        {article.title}
                                    </Link>
                                </h2>
                                <p className="text-text-muted mb-4">{article.description}</p>
                                <p className="text-sm text-text-muted mt-auto">{article.pubDate}</p>
                            </div>
                        </article>
                    )) : (
                         <div className="text-center py-16 bg-surface rounded-lg">
                           <p className="text-xl text-text-muted">
                                No se encontraron noticias que coincidan con tu búsqueda.
                           </p>
                        </div>
                    )}
                </div>
            )}
            <ScrollToTopButton />
        </div>
    );
};

export default LocalNews;