import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Podcasts from './pages/Podcasts';
import News from './pages/News';
import Ads from './pages/Ads';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import History from './pages/History';
import NewsDetail from './pages/NewsDetail'; // Importar el nuevo componente
import * as api from './services/api';
import { NewsArticle, Ad, Banner } from './types';
import { FaSpinner } from 'react-icons/fa';

function App() {
  // State for dynamic content
  const [banner, setBanner] = useState<Banner | null>(null);
  const [radioURL, setRadioURL] = useState('');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schemaIsOutdated, setSchemaIsOutdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bannerConfig, newsData, adsData] = await Promise.all([
          api.getBanner(),
          api.getNews(),
          api.getAds()
        ]);
        setBanner(bannerConfig.banner);
        setRadioURL(bannerConfig.banner.radio_url);
        setSchemaIsOutdated(bannerConfig.schemaIsOutdated);
        setNews(newsData);
        setAds(adsData);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateBanner = async (settings: Partial<Banner>) => {
    const bannerConfig = await api.updateBanner(settings);
    setBanner(bannerConfig.banner);
    setRadioURL(bannerConfig.banner.radio_url);
    setSchemaIsOutdated(bannerConfig.schemaIsOutdated);
  };

  const addNewsArticle = async (article: Omit<NewsArticle, 'id'>) => {
    await api.addNews(article);
    setNews(await api.getNews());
  };

  const editNewsArticle = async (updatedArticle: NewsArticle) => {
    await api.updateNews(updatedArticle);
    setNews(await api.getNews());
  };

  const deleteNewsArticle = async (id: number) => {
    await api.deleteNews(id);
    setNews(await api.getNews());
  };

  const addAd = async (ad: Omit<Ad, 'id'>) => {
    await api.addAd(ad);
    setAds(await api.getAds());
  };

  const editAd = async (updatedAd: Ad) => {
    await api.updateAd(updatedAd);
    setAds(await api.getAds());
  };
  
  const deleteAd = async (id: number) => {
    await api.deleteAd(id);
    setAds(await api.getAds());
  };

  if (loading || !banner || !radioURL) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <FaSpinner className="animate-spin text-primary text-5xl" />
        <p className="ml-4 text-2xl">Cargando Radio...</p>
      </div>
    );
  }

  return (
    <PlayerProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <main className="flex-grow pt-20 pb-40"> {/* Padding top for fixed header, padding bottom for fixed player */}
            <Routes>
              <Route path="/" element={<Home banner={banner} newsData={news} adsData={ads} />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/news" element={<News newsData={news} />} />
              <Route path="/news/:id" element={<NewsDetail adsData={ads} />} />
              <Route path="/history" element={<History />} />
              <Route path="/ads" element={<Ads adsData={ads} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/admin" element={isAuthenticated ? <Admin 
                banner={banner}
                schemaIsOutdated={schemaIsOutdated}
                updateBanner={handleUpdateBanner}
                newsData={news}
                addNewsArticle={addNewsArticle}
                editNewsArticle={editNewsArticle}
                deleteNewsArticle={deleteNewsArticle}
                adsData={ads}
                addAd={addAd}
                editAd={editAd}
                deleteAd={deleteAd}
              /> : <Login setIsAuthenticated={setIsAuthenticated} />} />

            </Routes>
          </main>
          <Footer />
          <AudioPlayer radioURL={radioURL} />
        </div>
      </HashRouter>
    </PlayerProvider>
  );
}

export default App;