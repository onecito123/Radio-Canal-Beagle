import { ParsedArticle } from '../types';

const rssFeeds = [
    { name: 'La Prensa Austral', url: 'https://laprensaaustral.cl/feed/' },
    { name: 'El Pingüino', url: 'https://www.elpinguino.com/feed/' },
    { name: 'El Magallanico', url: 'https://www.elmagallanico.com/feed/' },
];

const CORS_PROXY = 'https://corsproxy.io/?';

export const fetchLocalNews = async (): Promise<ParsedArticle[]> => {
    try {
        const allPromises = rssFeeds.map(async (feed) => {
            try {
                const response = await fetch(`${CORS_PROXY}${encodeURIComponent(feed.url)}`);
                if (!response.ok) {
                    console.error(`Error al cargar el feed de ${feed.name}: ${response.statusText}`);
                    return []; // Devuelve un array vacío para este feed si falla
                }
                const xmlText = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                
                if (xmlDoc.querySelector('parsererror')) {
                     console.error(`Error al parsear el XML de ${feed.name}`);
                     return [];
                }

                const items = xmlDoc.querySelectorAll('item');
                const parsedItems: ParsedArticle[] = [];

                items.forEach(item => {
                    const title = item.querySelector('title')?.textContent || 'Sin título';
                    const link = item.querySelector('link')?.textContent || '#';
                    
                    const rawDescription = item.querySelector('description')?.textContent || '';
                    const description = `${rawDescription.replace(/<[^>]*>?/gm, '').substring(0, 150)}...`;

                    const rawDate = new Date(item.querySelector('pubDate')?.textContent || '');
                    const pubDate = !isNaN(rawDate.getTime()) 
                        ? rawDate.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : 'Fecha desconocida';

                    let image = item.querySelector('enclosure[type^="image"]')?.getAttribute('url') || null;
                    if (!image) {
                       image = item.querySelector('media\\:content[medium="image"]')?.getAttribute('url') || null;
                    }
                    if (!image) {
                        const content = item.querySelector('content\\:encoded')?.textContent || rawDescription;
                        const imgMatch = content.match(/<img.*?src=["'](.*?)["']/);
                        image = imgMatch ? imgMatch[1] : null;
                    }

                    parsedItems.push({ title, link, description, pubDate, rawDate, image, source: feed.name });
                });
                return parsedItems;
            } catch (feedError) {
                console.error(`Error procesando el feed de ${feed.name}:`, feedError);
                return []; // Retorna vacío para no detener los demás
            }
        });

        const results = await Promise.all(allPromises);
        const allArticles = results.flat();
        
        allArticles.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
        return allArticles;

    } catch (globalError) {
        console.error("Error global al procesar los feeds:", globalError);
        return []; // Devuelve un array vacío en caso de un error mayor
    }
};
