import React from 'react';
import { Hexagon, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black/40 pt-20 pb-10 border-t border-border mt-auto">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-lg shadow-primary/20">
                                <Hexagon className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold text-white">Axis<span className="text-primary">Hub</span></span>
                        </div>
                        <p className="text-secondary text-sm leading-relaxed">
                            Sua plataforma confiável para licenças digitais e softwares premium. Segurança, rapidez e suporte em um só lugar.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-surface rounded-lg text-gray-400 hover:text-primary hover:bg-surface/80 transition-colors border border-border"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-surface rounded-lg text-gray-400 hover:text-primary hover:bg-surface/80 transition-colors border border-border"><Twitter size={18} /></a>
                            <a href="#" className="p-2 bg-surface rounded-lg text-gray-400 hover:text-primary hover:bg-surface/80 transition-colors border border-border"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Categorias</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Assinaturas Premium</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Softwares e Ferramentas</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Jogos e Keys</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Serviços de Streaming</a></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Suporte</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Reembolsos</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Fique por dentro</h4>
                        <p className="text-gray-500 text-sm mb-4">Receba ofertas exclusivas e novidades.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Seu e-mail"
                                className="w-full bg-surface border border-border rounded-lg py-2.5 px-4 text-sm text-gray-300 outline-none focus:border-primary transition-colors"
                            />
                            <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-primary/20">
                                Inscrever-se
                            </button>
                        </form>
                    </div>

                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-secondary text-sm">© 2024 Axis Hub. Todos os direitos reservados.</p>
                    <div className="flex gap-6 text-sm text-secondary">
                        <span>Desenvolvido com ❤️</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
