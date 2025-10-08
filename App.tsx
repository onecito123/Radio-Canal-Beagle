import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import LocalNews from './pages/LocalNews';
import LocalNewsReader from './pages/LocalNewsReader';
import ScrollToTop from './components/ScrollToTop';
import { PlayerProvider } from './context/PlayerContext';
import { Ad, Banner, ScheduleItem, ParsedArticle } from './types';
import * as api from './services/api';
import { fetchLocalNews } from './services/rss';
import { FaSpinner } from 'react-icons/fa';
import GlobalAdBanner from './components/GlobalAdBanner';

// Este nuevo componente contiene la lógica original de App y puede usar hooks de enrutador.
const AppContent = () => {
    // Todos los estados, efectos y manejadores del componente App original van aquí.
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [banner, setBanner] = useState<Banner | null>(null);
    const [schemaIsOutdated, setSchemaIsOutdated] = useState(false);
    const [adsData, setAdsData] = useState<Ad[]>([]);
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [scheduleTableExists, setScheduleTableExists] = useState(false);
    const [localNewsData, setLocalNewsData] = useState<ParsedArticle[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isNewsLoading, setIsNewsLoading] = useState(true);

    const handleRefreshNews = useCallback(async () => {
        setIsNewsLoading(true);
        try {
            const news = await fetchLocalNews();
            setLocalNewsData(news);
        } catch (error) {
            console.error("Failed to fetch local news:", error);
        } finally {
            setIsNewsLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsInitialLoading(true);
                const [bannerConfig, ads, scheduleConfig] = await Promise.all([
                    api.getBanner(),
                    api.getAds(),
                    api.getSchedule(),
                ]);
                
                setBanner(bannerConfig.banner);
                setSchemaIsOutdated(bannerConfig.schemaIsOutdated);
                setAdsData(ads);
                setScheduleData(scheduleConfig.schedule);
                setScheduleTableExists(scheduleConfig.tableExists);

                await handleRefreshNews();
            } catch (error) {
                console.error("Failed to load initial data:", error);
            } finally {
                setIsInitialLoading(false);
            }
        };
        loadInitialData();
    }, [handleRefreshNews]);

    // --- Manejadores de API para el Panel de Administración ---
    const handleUpdateBanner = async (settings: Partial<Banner>) => {
        const updatedBannerConfig = await api.updateBanner(settings);
        setBanner(updatedBannerConfig.banner);
        setSchemaIsOutdated(updatedBannerConfig.schemaIsOutdated);
    };
    
    const handleAddScheduleItem = async (item: Omit<ScheduleItem, 'id'>) => {
        const newItem = await api.addScheduleItem(item);
        setScheduleData(prev => [...prev, newItem].sort((a, b) => a.id - b.id));
    };

    const handleEditScheduleItem = async (item: ScheduleItem) => {
        const updatedItem = await api.updateScheduleItem(item);
        setScheduleData(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    };
    
    const handleDeleteScheduleItem = async (id: number) => {
        await api.deleteScheduleItem(id);
        setScheduleData(prev => prev.filter(i => i.id !== id));
    };

    const handleAddAd = async (ad: Omit<Ad, 'id'>) => {
        const newAd = await api.addAd(ad);
        setAdsData(prev => [...prev, newAd]);
    };

    const handleEditAd = async (ad: Ad) => {
        const updatedAd = await api.updateAd(ad);
        setAdsData(prev => prev.map(a => a.id === updatedAd.id ? updatedAd : a));
    };

    const handleDeleteAd = async (id: number) => {
        await api.deleteAd(id);
        setAdsData(prev => prev.filter(a => a.id !== id));
    };
    
    const location = useLocation();
    const hideAdBannerPaths = ['/'];
    const shouldShowAdBanner = !hideAdBannerPaths.includes(location.pathname);

    if (isInitialLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-background text-white">
                <FaSpinner className="animate-spin text-4xl" />
                <span className="ml-4 text-xl">Cargando Radio Canal Beagle...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-text-main font-sans">
            <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <main className="flex-grow pt-20 pb-28">
                <Routes>
                    <Route path="/" element={<Home banner={banner!} adsData={adsData} localNewsData={localNewsData} />} />
                    <Route path="/schedule" element={<Schedule scheduleData={scheduleData} />} />
                    <Route path="/local-news" element={<LocalNews localNewsData={localNewsData} loading={isNewsLoading} onRefresh={handleRefreshNews} />} />
                    <Route path="/local-news-reader" element={<LocalNewsReader />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route 
                        path="/admin" 
                        element={
                            isAuthenticated ? (
                                <Admin 
                                    banner={banner!}
                                    schemaIsOutdated={schemaIsOutdated}
                                    updateBanner={handleUpdateBanner}
                                    scheduleData={scheduleData}
                                    scheduleTableExists={scheduleTableExists}
                                    addScheduleItem={handleAddScheduleItem}
                                    editScheduleItem={handleEditScheduleItem}
                                    deleteScheduleItem={handleDeleteScheduleItem}
                                    adsData={adsData}
                                    addAd={handleAddAd}
                                    editAd={handleEditAd}
                                    deleteAd={handleDeleteAd}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            {shouldShowAdBanner && !isAuthenticated && adsData.length > 0 && <GlobalAdBanner adsData={adsData} />}
            {banner && <AudioPlayer radioURL={banner.radio_url} />}
            <Footer />
        </div>
    );
};


function App() {
  return (
    <PlayerProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </PlayerProvider>
  );
}

export default App;