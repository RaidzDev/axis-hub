import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center">

            {/* Background Grid & Vignette */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                ></div>
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>

                {/* Glow Effects */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full opacity-40"></div>
            </div>

            <div className="container relative z-10 flex flex-col items-center gap-6 md:gap-8">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
                        Suporte Online
                    </span>
                </div>

                {/* Headlines */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl">
                    Seu Hub de <br className="md:hidden" />
                    <span className="bg-gradient-to-r from-blue-400 to-primary bg-clip-text text-transparent">
                        Licenças Digitais
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-secondary max-w-2xl leading-relaxed px-4">
                    Compra rápida, entrega digital segura e suporte humano. <br className="hidden md:block" />
                    A melhor seleção de assinaturas e softwares premium.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6 px-4">
                    <button className="btn-primary flex items-center justify-center gap-2 group">
                        Ver produtos
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="btn-secondary flex items-center justify-center gap-2 hover:bg-white/5 border border-border rounded-xl px-6 py-3 font-bold text-gray-300 transition-all">
                        <PlayCircle size={18} />
                        Como funciona
                    </button>
                </div>

            </div>
        </section>
    );
};

export default Hero;
