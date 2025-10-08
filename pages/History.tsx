import React from 'react';
import { FaBan } from 'react-icons/fa';

const History: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-12">
                Historial de Canciones
            </h1>
            <div className="text-center text-text-muted py-16 max-w-2xl mx-auto bg-surface rounded-lg">
                <FaBan className="mx-auto text-5xl mb-4" />
                <p className="text-xl font-semibold">Función no disponible.</p>
                <p>El historial de canciones ha sido desactivado.</p>
            </div>
        </div>
    );
};

export default History;