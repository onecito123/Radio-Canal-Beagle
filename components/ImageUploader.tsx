import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FaImage, FaLink, FaTimes } from 'react-icons/fa';

interface ImageUploaderProps {
    onImageChange: (result: File | string | null) => void;
    initialImageUrl?: string | null;
    label: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, initialImageUrl, label }) => {
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
    const [urlValue, setUrlValue] = useState(initialImageUrl && !initialImageUrl.startsWith('blob:') ? initialImageUrl : '');
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(initialImageUrl || null);
         if (initialImageUrl && !initialImageUrl.startsWith('blob:')) {
            setUrlValue(initialImageUrl);
            setMode('url');
        } else {
            setMode('upload');
        }
    }, [initialImageUrl]);

    const handleFileChange = useCallback((files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            onImageChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageChange]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrlValue(newUrl);
        if (newUrl) {
            setPreview(newUrl); // Show preview instantly
            onImageChange(newUrl);
        } else {
            setPreview(null);
            onImageChange(null);
        }
    };
    
    const clearImage = () => {
        setPreview(null);
        setUrlValue('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onImageChange(null);
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(true); };
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(false); };
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFileChange(e.dataTransfer.files);
    };

    const TabButton: React.FC<{current: 'upload' | 'url', target: 'upload' | 'url', children: React.ReactNode}> = ({ current, target, children }) => (
        <button type="button" onClick={() => setMode(target)} className={`py-2 px-4 font-semibold text-sm rounded-t-lg flex items-center gap-2 ${current === target ? 'bg-background text-primary' : 'bg-transparent text-text-muted hover:bg-gray-800'}`}>
            {children}
        </button>
    );

    return (
        <div>
            <label className="block text-sm font-medium text-text-muted mb-2">{label}</label>
            <div className="flex border-b border-gray-700">
                <TabButton current={mode} target="upload"><FaImage /> Subir Archivo</TabButton>
                <TabButton current={mode} target="url"><FaLink /> Usar URL</TabButton>
            </div>
            <div className="bg-background p-4 rounded-b-lg">
                {preview && (
                    <div className="mb-4 relative">
                        <img src={preview} alt="Vista previa" className="max-h-48 w-auto mx-auto rounded-md object-contain" onError={() => setPreview('https://via.placeholder.com/300x150.png?text=URL+inválida')} />
                        <button type="button" onClick={clearImage} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80">
                            <FaTimes />
                        </button>
                    </div>
                )}
                {mode === 'upload' ? (
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragOver ? 'border-primary bg-background' : 'border-gray-600 hover:border-gray-500'}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                    >
                        <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} className="hidden" accept="image/png, image/jpeg, image/gif, image/webp" />
                        <div className="text-text-muted">
                            <FaImage className="mx-auto text-4xl mb-2" />
                            <p>Arrastra y suelta o haz clic para seleccionar</p>
                        </div>
                    </div>
                ) : (
                    <input
                        type="url"
                        value={urlValue}
                        onChange={handleUrlChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                )}
            </div>
        </div>
    );
};

export default ImageUploader;