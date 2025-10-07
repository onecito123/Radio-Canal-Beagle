import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { NewsArticle } from '../types';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';

interface NewsProps {
    newsData: NewsArticle[];
}

type SortOrder = 'newest' | 'oldest';

const News: React.FC<NewsProps> = ({ newsData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
    const articlesPerPage = 4;

    const sortedArticles = useMemo(() => {
        return [...newsData].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [newsData, sortOrder]);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const totalPages = Math.ceil(newsData.length / articlesPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Últimas Noticias</h1>
      
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 bg-surface p-2 rounded-lg">
            <label htmlFor="sort-order" className="text-text-muted">Ordenar por:</label>
            <select 
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="bg-background border border-gray-600 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <option value="newest">Más Recientes</option>
                <option value="oldest">Más Antiguos</option>
            </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {currentArticles.map(article => (
          <div key={article.id} className="bg-surface rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row">
            <ImageWithPlaceholder src={article.image} alt={article.title} className="w-full sm:w-1/3 h-64 sm:h-auto object-cover" />
            <div className="p-6 flex flex-col justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">{new Date(article.date).toLocaleDateString()}</p>
                <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                <p className="text-text-muted mb-4">{article.summary}</p>
              </div>
              <Link to={`/news/${article.id}`} className="font-semibold text-primary hover:text-orange-400 self-start">Leer más &rarr;</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <nav className="flex rounded-md shadow">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`py-2 px-4 border border-gray-700 transition-colors ${
                currentPage === number
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-muted hover:bg-background'
              } ${number === 1 ? 'rounded-l-md' : ''} ${number === totalPages ? 'rounded-r-md' : ''}`}
            >
              {number}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default News;
