import { supabase } from './supabase';
import { NewsArticle, Ad, Banner, BannerConfig } from '../types';

// IMPORTANTE: Para que la carga de imágenes funcione, debes:
// 1. Crear un "Bucket" en el Storage de Supabase llamado "images".
// 2. Ir a las políticas (Policies) de ese bucket y crear una nueva política
//    que permita las operaciones de "select" e "insert" para el rol "anon".
//    Esto es crucial para poder subir y mostrar las imágenes.

const IMAGE_BUCKET = 'images';
const DEFAULT_RADIO_URL = "https://stm16.voxhd.com.br:10872/stream";

// Helper for error handling
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Error in ${context}:`, error);
        let detailedMessage = error.message;
        if (error.message.includes("security policy")) {
            detailedMessage = `Viola la política de seguridad de la base de datos (Row Level Security).
            \nSolución: Ve a Supabase -> Database -> Policies y asegúrate de que la tabla correspondiente tiene una política que permita la operación (INSERT, UPDATE) para el rol 'anon'. Para las imágenes, ve a Storage -> Policies (en el bucket) y permite 'insert' y 'select' para 'anon'.`;
        }
        if (error.message.includes("Bucket not found")) {
            detailedMessage = `Bucket de Storage no encontrado.
            \nSolución: Ve a Supabase -> Storage y asegúrate de haber creado un Bucket llamado exactamente '${IMAGE_BUCKET}'.`;
        }
        if (error.message.includes("Invalid key")) {
             detailedMessage = `La clave (nombre de archivo) para el almacenamiento es inválida: ${error.message}.
             \nEsto suele ocurrir por caracteres especiales en el nombre del archivo. El sistema intentó sanitizarlo, pero puede que aún haya un problema.`;
        }
        throw new Error(detailedMessage);
    }
};

// Helper to sanitize filenames for Supabase Storage to prevent "Invalid key" errors.
const sanitizeFileName = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.');
    const name = lastDotIndex === -1 ? fileName : fileName.substring(0, lastDotIndex);
    const extension = lastDotIndex === -1 ? '' : fileName.substring(lastDotIndex);

    const sanitizedName = name
        .normalize("NFD") // Separate accents from letters
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-zA-Z0-9\-_]/g, '-') // Replace non-alphanumeric (except hyphen/underscore) with hyphen
        .replace(/-+/g, '-') // Collapse multiple hyphens
        .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
        .toLowerCase();

    return sanitizedName + extension.toLowerCase();
};


// --- Image Upload API ---
export const uploadImage = async (file: File): Promise<string> => {
    const sanitizedFileName = sanitizeFileName(file.name);
    const filePath = `${Date.now()}-${sanitizedFileName}`;
    const { error: uploadError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(filePath, file);

    handleSupabaseError(uploadError, 'uploadImage');

    const { data } = supabase.storage
        .from(IMAGE_BUCKET)
        .getPublicUrl(filePath);
    
    if (!data.publicUrl) {
        throw new Error("Could not get public URL for uploaded image.");
    }
    
    return data.publicUrl;
};


// --- Banner API ---
export const getBanner = async (): Promise<BannerConfig> => {
    // First, try to get all data including the new fields
    const { data, error } = await supabase
        .from('banner')
        .select('text, image, secondary_banner_image, secondary_banner_visible, radio_url')
        .eq('id', 1)
        .single();

    // If there's an error about a missing column, the DB schema is outdated.
    if (error && error.message.includes("column") && error.message.includes("does not exist")) {
        console.warn(`[RADIO APP] Fallback activated for getBanner. Could not fetch all fields from the database.
        This is likely because one or more columns are missing from your 'banner' table.
        Please run the appropriate SQL in your Supabase SQL Editor to add them.`);
        
        const { data: fallbackData, error: fallbackError } = await supabase
            .from('banner')
            .select('text, image')
            .eq('id', 1)
            .single();
        
        handleSupabaseError(fallbackError, 'getBanner (fallback)');
        
        // Return existing data with default values for the new fields.
        const banner: Banner = { 
            text: fallbackData?.text || 'Bienvenido a Radio Canal Beagle',
            image: fallbackData?.image || 'https://default-image.url/hero.jpg',
            secondary_banner_image: 'https://picsum.photos/seed/secondarybanner/1200/250',
            secondary_banner_visible: true,
            radio_url: DEFAULT_RADIO_URL,
        };
        return { banner, schemaIsOutdated: true };
    }

    handleSupabaseError(error, 'getBanner');
    const banner: Banner = {
        text: data?.text || 'Bienvenido a Radio Canal Beagle', 
        image: data?.image || 'https://default-image.url/hero.jpg', 
        secondary_banner_image: data?.secondary_banner_image || null, 
        secondary_banner_visible: data?.secondary_banner_visible || false,
        radio_url: data?.radio_url || DEFAULT_RADIO_URL,
    };
    return { banner, schemaIsOutdated: false };
};

export const updateBanner = async (newBanner: Partial<Banner>): Promise<BannerConfig> => {
    // The Supabase 'update' function will fail if a column does not exist.
    // To handle this gracefully, we separate the updates.

    const mainBannerUpdate: Partial<Banner> = {};
    if (newBanner.text !== undefined) mainBannerUpdate.text = newBanner.text;
    if (newBanner.image !== undefined) mainBannerUpdate.image = newBanner.image;
    if (newBanner.radio_url !== undefined) mainBannerUpdate.radio_url = newBanner.radio_url;

    if (Object.keys(mainBannerUpdate).length > 0) {
        const { error: mainError } = await supabase
            .from('banner')
            .update(mainBannerUpdate)
            .eq('id', 1);
        handleSupabaseError(mainError, 'updateBanner (main/radio)');
    }
    
    const secondaryBannerUpdate: Partial<Banner> = {};
    if (newBanner.secondary_banner_image !== undefined) secondaryBannerUpdate.secondary_banner_image = newBanner.secondary_banner_image;
    if (newBanner.secondary_banner_visible !== undefined) secondaryBannerUpdate.secondary_banner_visible = newBanner.secondary_banner_visible;

    if (Object.keys(secondaryBannerUpdate).length > 0) {
        const { error: secondaryError } = await supabase
            .from('banner')
            .update(secondaryBannerUpdate)
            .eq('id', 1);
        
        // For secondary fields, we only warn in the console instead of throwing an error.
        // This allows the main banner settings to be saved even if the schema is not updated.
        if (secondaryError) {
            console.warn(`[RADIO APP] Failed to update secondary banner fields. They will not be saved.
            Error: ${secondaryError.message}.
            Please update your database schema to persist these changes.`);
        }
    }

    // After attempting updates, refetch everything using our safe getter.
    return getBanner();
};


// --- News API ---
export const getNews = async (): Promise<NewsArticle[]> => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });

    handleSupabaseError(error, 'getNews');
    return data || [];
};

export const getNewsById = async (id: number): Promise<NewsArticle> => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
    
    handleSupabaseError(error, `getNewsById ${id}`);
    if (!data) throw new Error("Article not found");
    return data;
};


export const addNews = async (article: Omit<NewsArticle, 'id' | 'created_at'>): Promise<NewsArticle> => {
    const { data, error } = await supabase
        .from('news')
        .insert([article])
        .select()
        .single();

    handleSupabaseError(error, 'addNews');
    return data;
};

export const updateNews = async (updatedArticle: NewsArticle): Promise<NewsArticle> => {
    const { id, ...articleToUpdate } = updatedArticle;
    const { data, error } = await supabase
        .from('news')
        .update(articleToUpdate)
        .eq('id', id)
        .select()
        .single();
        
    handleSupabaseError(error, 'updateNews');
    return data;
};

export const deleteNews = async (id: number): Promise<{ success: true }> => {
    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

    handleSupabaseError(error, 'deleteNews');
    return { success: true };
};

// --- Ads API ---
export const getAds = async (): Promise<Ad[]> => {
    const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: true });
    
    handleSupabaseError(error, 'getAds');
    return data || [];
};

export const addAd = async (ad: Omit<Ad, 'id' | 'created_at'>): Promise<Ad> => {
    const { data, error } = await supabase
        .from('ads')
        .insert([ad])
        .select()
        .single();
        
    handleSupabaseError(error, 'addAd');
    return data;
};

export const updateAd = async (updatedAd: Ad): Promise<Ad> => {
    const { id, ...adToUpdate } = updatedAd;
    const { data, error } = await supabase
        .from('ads')
        .update(adToUpdate)
        .eq('id', id)
        .select()
        .single();
    
    handleSupabaseError(error, 'updateAd');
    return data;
};

export const deleteAd = async (id: number): Promise<{ success: true }> => {
    const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);
        
    handleSupabaseError(error, 'deleteAd');
    return { success: true };
};