import React, { useState } from 'react';

// Una URL de un servicio que genera imágenes de marcador de posición
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/728x90.png?text=Imagen+no+disponible';

interface ImageWithPlaceholderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string | undefined | null;
    alt: string;
}

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({ src, alt, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER_IMAGE);

    // Si la carga de la imagen principal falla, cambiamos la fuente a la del marcador de posición
    const handleError = () => {
        setImgSrc(PLACEHOLDER_IMAGE);
    };

    return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

export default ImageWithPlaceholder;
