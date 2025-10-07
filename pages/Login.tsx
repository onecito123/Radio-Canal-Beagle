import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setIsAuthenticated: (isAuth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded authentication
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
            navigate('/admin');
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
            <div className="w-full max-w-md">
                <form onSubmit={handleLogin} className="bg-surface shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h1>
                    <div className="mb-4">
                        <label className="block text-text-muted text-sm font-bold mb-2" htmlFor="username">
                            Usuario (admin)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 bg-background border-gray-600 text-text-main leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary"
                            id="username"
                            type="text"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-text-muted text-sm font-bold mb-2" htmlFor="password">
                            Contraseña (password)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 bg-background border-gray-600 text-text-main mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;