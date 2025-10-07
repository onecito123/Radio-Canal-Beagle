

import React, { useState } from 'react';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setStatus('Por favor, completa todos los campos.');
            return;
        }
        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setStatus('Por favor, introduce un email válido.');
            return;
        }
        
        setStatus('Gracias por tu mensaje. Nos pondremos en contacto pronto.');
        setFormData({ name: '', email: '', message: '' });
        // Here you would typically send the form data to a server
    };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Contáctanos</h1>
        <p className="text-center text-text-muted mb-12">¿Tienes alguna pregunta, sugerencia o saludo? ¡Nos encantaría escucharte!</p>

        <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-lg space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">Nombre</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-1">Mensaje</label>
            <textarea 
              name="message" 
              id="message" 
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-required="true"
            ></textarea>
          </div>
          <div className="text-center">
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Enviar Mensaje
            </button>
          </div>
          {status && <p className="text-center mt-4">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;