import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, KeyRound } from 'lucide-react';

const AdminLogin = () => {
    const [step, setStep] = useState(1); // 1: Password, 2: 2FA
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [code, setCode] = useState('');
    const [tempId, setTempId] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await api.adminLogin(password);

            // Direct Login (2FA Disabled for now)
            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin/dashboard');
            } else {
                throw new Error('Credenciais inválidas ou resposta inesperada.');
            }
        } catch (err) {
            setError(err.message || 'Credenciais inválidas');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0E1117] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0E1117] to-[#0E1117]"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

            <div className="relative z-10 w-full max-w-md">

                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-900/20 mb-4">
                        <ShieldCheck className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Axis<span className="text-blue-500">Hub</span></h1>
                    <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Área Restrita</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-[#111827] rounded-3xl border border-white/5 shadow-2xl p-8 backdrop-blur-xl relative overflow-hidden">
                    {/* Top Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-blue-500/50 blur-lg rounded-full"></div>

                    <h2 className="text-xl font-bold text-white text-center mb-2">
                        Acesso Administrativo
                    </h2>
                    <p className="text-gray-400 text-sm text-center mb-8">
                        Digite sua senha mestre para continuar
                    </p>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 animate-shake">
                            <ShieldCheck className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Senha Mestra</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0B0D12] text-white border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-11 pr-12 py-3.5 placeholder-gray-500 transition-all font-medium text-base shadow-inner"
                                    placeholder="Digite sua senha"
                                    disabled={isLoading}
                                    style={{ colorScheme: 'dark' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 group"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Continuar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-xs text-gray-600">
                        &copy; 2024 Axis Hub Security System.
                    </p>
                    <div className="flex justify-center gap-4 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1"><Lock size={10} /> TLS Encrypted</span>
                        <span>•</span>
                        <span>Secure Access</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
