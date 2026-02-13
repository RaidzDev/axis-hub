import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, Hexagon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate(`/#${targetId}`);
            // Use timeout to allow navigation to complete before scrolling
            setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(targetId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300 ${isScrolled ? 'glass-header' : 'bg-transparent'
                    }`}
            >
                <div className="container flex items-center justify-between gap-4 md:gap-8">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/20 group-hover:shadow-blue-600/30 transition-all duration-300">
                            <Hexagon className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                            Axis<span className="text-primary">Hub</span>
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-[480px] relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Encontre sua licença ou assinatura..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    alert('Busca em desenvolvimento: ' + e.target.value);
                                }
                            }}
                            className="w-full h-11 bg-surface/80 border border-t border-border rounded-full pl-12 pr-4 text-sm text-gray-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-500"
                        />
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-secondary">
                        <Link to="/#categorias" onClick={(e) => handleNavClick(e, 'categorias')} className="hover:text-white transition-colors">Categorias</Link>
                        <Link to="/" className="hover:text-white transition-colors">Ver Produtos</Link>
                        <Link to="/#assinaturas" className="hover:text-white transition-colors">Assinaturas</Link>
                        <a href="#como-funciona" onClick={(e) => handleNavClick(e, 'como-funciona')} className="hover:text-white transition-colors">Como funciona</a>
                        <a href="#suporte" onClick={(e) => handleNavClick(e, 'suporte')} className="hover:text-white transition-colors">Suporte</a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4 shrink-0">
                        <Link to="/checkout" className="relative p-2 rounded-full hover:bg-white/5 text-gray-300 transition-colors" aria-label="Carrinho">
                            <ShoppingCart size={22} />
                            {/* Example cart count - logic to come from context ideally */}
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cta rounded-full text-[10px] flex items-center justify-center font-bold text-white shadow-sm">
                                0
                            </span>
                        </Link>

                        <button
                            onClick={() => navigate('/admin/login')}
                            className="hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border bg-surface/50 hover:bg-surface hover:border-white/10 transition-all group">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center">
                                <User size={16} className="text-gray-200" />
                            </div>
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">Minha conta</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 text-gray-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-[80px] px-6">
                    <div className="flex flex-col gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        alert('Busca em desenvolvimento: ' + e.target.value);
                                    }
                                }}
                                className="w-full bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-gray-200 outline-none focus:border-primary"
                            />
                        </div>
                        <nav className="flex flex-col gap-2 text-lg font-medium text-gray-300">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-border hover:text-white hover:pl-2 transition-all">Ver Produtos</Link>
                            <a href="#categorias" onClick={(e) => handleNavClick(e, 'categorias')} className="py-3 border-b border-border hover:text-white hover:pl-2 transition-all">Categorias</a>
                            <a href="#assinaturas" className="py-3 border-b border-border hover:text-white hover:pl-2 transition-all">Assinaturas</a>
                            <a href="#como-funciona" onClick={(e) => handleNavClick(e, 'como-funciona')} className="py-3 border-b border-border hover:text-white hover:pl-2 transition-all">Como funciona</a>
                            <a href="#suporte" onClick={(e) => handleNavClick(e, 'suporte')} className="py-3 border-b border-border hover:text-white hover:pl-2 transition-all">Suporte</a>
                            <Link to="/admin/login" className="py-3 text-primary hover:text-primary-hover font-bold mt-2" onClick={() => setIsMobileMenuOpen(false)}>Minha Conta / Login</Link>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
