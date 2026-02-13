import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await api.adminLogin(password);
            localStorage.setItem('adminToken', data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Senha incorreta');
        }
    };

    return (
        <div className="min-h-screen bg-secondary-900 flex items-center justify-center px-4">
            <div className="bg-secondary-800 p-8 rounded-2xl border border-secondary-700 w-full max-w-md shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary-500/10 p-4 rounded-full">
                        <Lock className="w-8 h-8 text-primary-500" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-6">Acesso Administrativo</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha do Admin"
                            className="w-full bg-secondary-900 border border-secondary-700 rounded-xl px-4 py-3 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors shadow-inner"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02]"
                    >
                        Entrar no Painel
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-secondary-400 text-sm hover:text-white mt-4"
                    >
                        Voltar para o Site
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
