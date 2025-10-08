import React, { useState, useEffect } from 'react';
import { Ad, Banner, ScheduleItem } from '../types';
import * as api from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import ImageUploader from '../components/ImageUploader';

interface AdminProps {
    banner: Banner;
    schemaIsOutdated: boolean;
    updateBanner: (settings: Partial<Banner>) => Promise<void>;
    scheduleData: ScheduleItem[];
    scheduleTableExists: boolean;
    addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => Promise<void>;
    editScheduleItem: (item: ScheduleItem) => Promise<void>;
    deleteScheduleItem: (id: number) => Promise<void>;
    adsData: Ad[];
    addAd: (ad: Omit<Ad, 'id'>) => Promise<void>;
    editAd: (ad: Ad) => Promise<void>;
    deleteAd: (id: number) => Promise<void>;
}

const Admin: React.FC<AdminProps> = ({
    banner, schemaIsOutdated, updateBanner,
    scheduleData, scheduleTableExists, addScheduleItem, editScheduleItem, deleteScheduleItem,
    adsData, addAd, editAd, deleteAd
}) => {
    // General Status
    const [status, setStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Banner State
    const [bannerText, setBannerText] = useState(banner.text);
    const [radioUrl, setRadioUrl] = useState(banner.radio_url);
    const [mainBannerImgSource, setMainBannerImgSource] = useState<File | string | null>(banner.image);
    const [secondaryBannerVisible, setSecondaryBannerVisible] = useState(banner.secondary_banner_visible);
    const [secondaryBannerImgSource, setSecondaryBannerImgSource] = useState<File | string | null>(banner.secondary_banner_image);

    // Schedule State
    const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    // Ad State
    const [editingAd, setEditingAd] = useState<Ad | null>(null);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);

    useEffect(() => {
        if (status) {
            const timer = setTimeout(() => setStatus(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [status]);
    
    // --- Banner Handler ---
    const handleBannerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let finalMainImageUrl = banner.image;
            if (mainBannerImgSource && mainBannerImgSource !== banner.image) {
                if (mainBannerImgSource instanceof File) {
                    finalMainImageUrl = await api.uploadImage(mainBannerImgSource);
                } else {
                    finalMainImageUrl = mainBannerImgSource;
                }
            }

            let finalSecondaryImageUrl = banner.secondary_banner_image;
             if (secondaryBannerImgSource && secondaryBannerImgSource !== banner.secondary_banner_image) {
                if (secondaryBannerImgSource instanceof File) {
                    finalSecondaryImageUrl = await api.uploadImage(secondaryBannerImgSource);
                } else {
                    finalSecondaryImageUrl = secondaryBannerImgSource;
                }
            } else if (!secondaryBannerImgSource) {
                finalSecondaryImageUrl = null;
            }

            await updateBanner({
                text: bannerText,
                image: finalMainImageUrl,
                radio_url: radioUrl,
                secondary_banner_visible: secondaryBannerVisible,
                secondary_banner_image: finalSecondaryImageUrl,
            });
            setStatus('Configuración del banner actualizada con éxito!');
        } catch(error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar el banner.";
            setStatus(`Error: ${errorMessage}`);
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Schedule Handlers ---
    const handleOpenScheduleModal = (item: ScheduleItem | null) => {
        setEditingSchedule(item);
        setIsScheduleModalOpen(true);
    };

    const handleSaveSchedule = async (itemToSave: ScheduleItem) => {
        try {
            if (itemToSave.id) {
                await editScheduleItem(itemToSave);
                setStatus('Programa actualizado con éxito!');
            } else {
                await addScheduleItem(itemToSave);
                setStatus('Programa agregado con éxito!');
            }
            setIsScheduleModalOpen(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
            console.error("Error saving schedule item:", errorMessage);
            alert(`Error al guardar el programa:\n\n${errorMessage}`);
            throw error;
        }
    };

    const handleDeleteSchedule = async (id: number) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar este programa?')) {
            await deleteScheduleItem(id);
            setStatus('Programa eliminado con éxito.');
        }
    };

    // --- Ad Handlers ---
    const handleOpenAdModal = (ad: Ad | null) => {
        setEditingAd(ad);
        setIsAdModalOpen(true);
    };

    const handleSaveAd = async (adToSave: Ad) => {
         try {
            if (adToSave.id) {
                await editAd(adToSave);
                setStatus('Anuncio actualizado con éxito!');
            } else {
                await addAd(adToSave);
                setStatus('Anuncio agregado con éxito!');
            }
            setIsAdModalOpen(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
            console.error("Error saving ad:", errorMessage);
            alert(`Error al guardar el anuncio:\n\n${errorMessage}`);
            throw error; // Relanzar para que el modal sepa que hubo un error
        }
    };
    
    const handleDeleteAd = async (id: number) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
            await deleteAd(id);
            setStatus('Anuncio eliminado con éxito.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Panel de Administración</h1>
            
            {status && <div className={`text-white text-center p-3 rounded-md mb-8 transition-opacity duration-300 ${status.startsWith('Error') ? 'bg-red-600' : 'bg-green-600'}`}>{status}</div>}
            
            <div className="space-y-12">
                {/* Banner Section */}
                <AdminSection title="Gestión de Banners y Radio">
                    <form onSubmit={handleBannerSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Configuración General</h3>
                            <div className="space-y-4">
                               <FormInput label="Texto del Banner Principal" value={bannerText} onChange={setBannerText} />
                               <ImageUploader label="Imagen de Fondo del Banner" onImageChange={setMainBannerImgSource} initialImageUrl={banner.image} />
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-700 pt-6">
                             {schemaIsOutdated ? (
                                <SchemaWarning />
                            ) : (
                                <>
                                 <h3 className="text-xl font-semibold mb-4">URL de Transmisión de Radio</h3>
                                 <FormInput label="URL del Stream" value={radioUrl} onChange={setRadioUrl} placeholder="https://.../stream" />
                                 
                                <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4">Banner Publicitario Secundario</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-3 bg-background rounded-md">
                                        <input
                                            type="checkbox"
                                            id="showSecondaryBanner"
                                            checked={secondaryBannerVisible}
                                            onChange={(e) => setSecondaryBannerVisible(e.target.checked)}
                                            className="h-5 w-5 rounded text-primary bg-gray-700 border-gray-600 focus:ring-primary"
                                        />
                                        <label htmlFor="showSecondaryBanner" className="font-medium text-text-main select-none">
                                            Mostrar este banner en la página de inicio
                                        </label>
                                    </div>
                                    <ImageUploader 
                                        label="Imagen del Banner Secundario" 
                                        onImageChange={setSecondaryBannerImgSource} 
                                        initialImageUrl={banner.secondary_banner_image} 
                                    />
                                </div>
                                </div>
                                </>
                            )}
                        </div>

                        <button type="submit" disabled={isSaving} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-full flex items-center justify-center disabled:bg-gray-500 mt-6">
                            {isSaving && <FaSpinner className="animate-spin mr-2" />}
                            {isSaving ? 'Guardando...' : 'Guardar Cambios Generales'}
                        </button>
                    </form>
                </AdminSection>

                {/* Schedule Section */}
                <AdminSection title="Gestión de Programación" buttonText={scheduleTableExists ? "Agregar Programa" : undefined} onButtonClick={scheduleTableExists ? () => handleOpenScheduleModal(null) : undefined}>
                    {scheduleTableExists ? (
                        <div className="space-y-4">
                            {scheduleData.length > 0 ? scheduleData.map(item => (
                                <ListItem key={item.id} title={item.program} subtitle={`${item.day} - ${item.time}`} onEdit={() => handleOpenScheduleModal(item)} onDelete={() => handleDeleteSchedule(item.id)} />
                            )) : (
                                <p className="text-text-muted text-center py-4">No hay programas para mostrar. ¡Agrega el primero!</p>
                            )}
                        </div>
                    ) : (
                        <CreateTableWarning
                            featureName="la gestión de la programación"
                            tableName="schedule"
                            sqlScript={`CREATE TABLE public.schedule (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  program TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;

-- Política para permitir la lectura pública
CREATE POLICY "Enable read access for all users"
ON public.schedule FOR SELECT USING (true);

-- Política para permitir todas las acciones a usuarios anónimos (para este prototipo)
CREATE POLICY "Enable all actions for anonymous users"
ON public.schedule FOR ALL USING (true) WITH CHECK (true);`}
                        />
                    )}
                </AdminSection>


                {/* Ads Section */}
                <AdminSection title="Gestión de Anuncios" buttonText="Agregar Anuncio" onButtonClick={() => handleOpenAdModal(null)}>
                     <div className="space-y-4">
                        {adsData.map(ad => (
                            <ListItem key={ad.id} title={ad.company} subtitle={ad.text} onEdit={() => handleOpenAdModal(ad)} onDelete={() => handleDeleteAd(ad.id)} />
                        ))}
                    </div>
                </AdminSection>
            </div>
            
            {/* Modals */}
            {isScheduleModalOpen && <ScheduleEditModal scheduleItem={editingSchedule} onSave={handleSaveSchedule} onClose={() => setIsScheduleModalOpen(false)} />}
            {isAdModalOpen && <AdEditModal ad={editingAd} onSave={handleSaveAd} onClose={() => setIsAdModalOpen(false)} />}
        </div>
    );
};

// --- Sub-components for Admin Page ---

const SchemaWarning: React.FC = () => (
    <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-100 p-4 rounded-r-lg" role="alert">
        <p className="font-bold">¡Atención! Funcionalidad limitada.</p>
        <p className="text-sm mt-2">La base de datos no está actualizada para gestionar todas las funciones. Para habilitarlas, ejecuta el siguiente código en el Editor SQL de Supabase:</p>
        <code className="block bg-background text-text-main font-mono text-xs p-3 rounded-md mt-4 whitespace-pre-wrap">
            {'-- Agrega campos para el banner secundario\nALTER TABLE public.banner\nADD COLUMN secondary_banner_visible BOOLEAN DEFAULT false;\n\nALTER TABLE public.banner\nADD COLUMN secondary_banner_image TEXT;\n\n-- Agrega campo para la URL de la radio\nALTER TABLE public.banner\nADD COLUMN radio_url TEXT;'}
        </code>
        <p className="text-sm mt-3">Después de ejecutar el código, recarga esta página.</p>
    </div>
);

const CreateTableWarning: React.FC<{featureName: string, tableName: string, sqlScript: string}> = ({featureName, tableName, sqlScript}) => (
    <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-100 p-4 rounded-r-lg" role="alert">
        <p className="font-bold">¡Función Deshabilitada!</p>
        <p className="text-sm mt-2">La tabla <code className="font-mono text-sm bg-background px-1 rounded">{tableName}</code> no existe en la base de datos. Para habilitar {featureName}, ejecuta el siguiente código en el Editor SQL de tu proyecto de Supabase:</p>
        <code className="block bg-background text-text-main font-mono text-xs p-3 rounded-md mt-4 whitespace-pre-wrap">
            {sqlScript}
        </code>
        <p className="text-sm mt-3">Después de ejecutar el código, recarga esta página.</p>
    </div>
);

const AdminSection: React.FC<{title: string; children: React.ReactNode; buttonText?: string; onButtonClick?: () => void;}> = ({ title, children, buttonText, onButtonClick }) => (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            {buttonText && onButtonClick && (
                <button onClick={onButtonClick} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full inline-flex items-center">
                    <FaPlus className="mr-2" /> {buttonText}
                </button>
            )}
        </div>
        {children}
    </div>
);

const ListItem: React.FC<{title: string, subtitle: string, onEdit: () => void, onDelete: () => void}> = ({ title, subtitle, onEdit, onDelete }) => (
    <div className="bg-background p-4 rounded-md flex justify-between items-center">
        <div>
            <p className="font-bold">{title}</p>
            <p className="text-sm text-text-muted truncate max-w-lg">{subtitle}</p>
        </div>
        <div className="flex space-x-2">
            <button onClick={onEdit} className="text-blue-400 hover:text-blue-300 p-2"><FaEdit /></button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-400 p-2"><FaTrash /></button>
        </div>
    </div>
);

const FormInput: React.FC<{label: string, value: string, onChange: (val: string) => void, placeholder?: string}> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-text-muted mb-1">{label}</label>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"/>
    </div>
);

// --- Modal Components ---

const Modal: React.FC<{title: string, children: React.ReactNode, onClose: () => void}> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-surface p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold">{title}</h2>
                 <button onClick={onClose} className="text-2xl font-bold text-text-muted hover:text-white">&times;</button>
            </div>
            <div className="overflow-y-auto pr-2">
                {children}
            </div>
        </div>
    </div>
);

const ScheduleEditModal: React.FC<{scheduleItem: ScheduleItem | null, onSave: (item: ScheduleItem) => Promise<void>, onClose: () => void}> = ({ scheduleItem, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<ScheduleItem, 'id'> & { id?: number }>(
        scheduleItem || { day: 'Lunes', time: '', program: '' }
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData as ScheduleItem);
        } catch (error) {
            setIsSaving(false);
        }
    };

    return (
        <Modal title={scheduleItem ? 'Editar Programa' : 'Agregar Programa'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="day" className="block text-sm font-medium text-text-muted mb-1">Día</label>
                    <select name="day" id="day" value={formData.day} onChange={handleChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3" required>
                        <option>Lunes</option>
                        <option>Martes</option>
                        <option>Miércoles</option>
                        <option>Jueves</option>
                        <option>Viernes</option>
                        <option>Sábado</option>
                        <option>Domingo</option>
                    </select>
                </div>
                <input name="time" placeholder="Horario (ej. 10:00 - 12:00)" value={formData.time} onChange={handleChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3" required />
                <input name="program" placeholder="Nombre del Programa" value={formData.program} onChange={handleChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3" required />
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full" disabled={isSaving}>Cancelar</button>
                    <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-full flex items-center justify-center w-32" disabled={isSaving}>
                        {isSaving ? <FaSpinner className="animate-spin" /> : 'Guardar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};


const AdEditModal: React.FC<{ad: Ad | null, onSave: (ad: Ad) => Promise<void>, onClose: () => void}> = ({ ad, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Ad, 'id'> & { id?: number }>(
        ad || { company: '', text: '', url: '', image: '' }
    );
    const [imageSource, setImageSource] = useState<File | string | null>(ad?.image || null);
    const [isSaving, setIsSaving] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let imageUrl = formData.image;
            if (imageSource) {
                 if (imageSource instanceof File) {
                    imageUrl = await api.uploadImage(imageSource);
                } else {
                    imageUrl = imageSource;
                }
            }
            if (!imageUrl) {
                alert("Por favor, selecciona una imagen para el anuncio.");
                setIsSaving(false);
                return;
            }
            await onSave({ ...formData, image: imageUrl } as Ad);
        } catch (error) {
            // Error is already alerted in the parent, just stop loading
            setIsSaving(false);
        }
    };

    return (
        <Modal title={ad ? 'Editar Anuncio' : 'Agregar Anuncio'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="company" placeholder="Nombre de la empresa" value={formData.company} onChange={handleChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3" required />
                <input name="text" placeholder="Texto del anuncio" value={formData.text} onChange={handleChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3" required />
                <input name="url" placeholder="https://www.ejemplo.com" value={formData.url} onChange={handleChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3" />
                <ImageUploader label="Imagen del Anuncio" onImageChange={setImageSource} initialImageUrl={formData.image} />
                 <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full" disabled={isSaving}>Cancelar</button>
                    <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-full flex items-center justify-center w-32" disabled={isSaving}>
                        {isSaving ? <FaSpinner className="animate-spin" /> : 'Guardar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default Admin;