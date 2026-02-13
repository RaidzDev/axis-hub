import React from 'react';
import { MessageSquare, HeartHandshake } from 'lucide-react';

const SupportSection = () => {
    return (
        <section id="suporte" className="py-24 bg-background relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="container relative z-10">
                <div className="bg-gradient-to-br from-surface to-background rounded-3xl p-8 md:p-16 border border-border flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">

                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
                            <HeartHandshake size={14} /> Suporte Humanizado
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Precisa de <span className="text-primary">Ajuda?</span>
                        </h2>
                        <p className="text-lg text-secondary mb-8 leading-relaxed">
                            Nosso time está pronto para te atender. Dúvidas sobre instalação, ativação ou pagamentos? Chama a gente no suporte!
                        </p>
                        <button className="btn-primary flex items-center gap-3 px-8 py-4">
                            <MessageSquare size={20} />
                            Falar com Suporte
                        </button>
                    </div>

                    <div className="relative">
                        {/* Contextual Illustration Placeholder */}
                        <div className="w-64 h-64 md:w-80 md:h-80 relative flex items-center justify-center">
                            {/* Abstract shape representing mascot/support */}
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative z-10 bg-surface p-8 rounded-full border border-border shadow-2xl">
                                <HeartHandshake size={80} className="text-primary" />
                            </div>
                            {/* Decoration elements */}
                            <div className="absolute -top-4 -right-4 bg-surface p-3 rounded-xl border border-border shadow-lg animate-bounce delay-100">
                                <span className="text-2xl">👋</span>
                            </div>
                            <div className="absolute -bottom-2 -left-4 bg-surface p-3 rounded-xl border border-border shadow-lg animate-bounce delay-700">
                                <span className="text-2xl">💬</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SupportSection;
