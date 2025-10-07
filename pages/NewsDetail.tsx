import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsById } from '../services/api';
import { NewsArticle, Ad } from '../types';
import { FaSpinner, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';
import AdCarousel from '../components/AdCarousel';

interface NewsDetailProps {
    adsData: Ad[];
}

const NewsDetail: React.FC<NewsDetailProps> = ({ adsData }) => {
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) {
                setError("No se proporcionó un ID de noticia.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const articleData = await getNewsById(parseInt(id, 10));
                setArticle(articleData);
                setError('');
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar la noticia. Puede que no exista.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-primary text-4xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 text-xl">{error}</p>
                <Link to="/news" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary-hover">
                    Volver a Noticias
                </Link>
            </div>
        );
    }

    if (!article) {
        return null; // Should be handled by error state
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Wrapper for the article content, keeping it narrow for readability */}
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link to="/news" className="inline-flex items-center text-primary hover:text-orange-400 transition-colors">
                        <FaArrowLeft className="mr-2" />
                        Volver a Todas las Noticias
                    </Link>
                </div>
                
                <article className="bg-surface p-6 sm:p-10 rounded-lg shadow-lg">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-main leading-tight">{article.title}</h1>
                    <div className="flex items-center text-text-muted mb-6">
                        <FaCalendarAlt className="mr-2" />
                        <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    </div>
                    
                    <ImageWithPlaceholder src={article.image} alt={article.title} className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-md" />
                    
                    <div className="prose prose-invert prose-lg max-w-none text-text-main" style={{ whiteSpace: 'pre-wrap' }}>
                        <p className="text-xl italic text-text-muted mb-6">{article.summary}</p>
                        {article.content}
                    </div>
                </article>
            </div>

            {/* Ad section is now outside the narrow wrapper, allowing it to match the homepage carousel's width */}
            {adsData && adsData.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-3xl font-bold text-center mb-8">Nuestros Patrocinadores</h2>
                    <AdCarousel adsData={adsData} />
                </section>
            )}
        </div>
    );
};

export default NewsDetail;