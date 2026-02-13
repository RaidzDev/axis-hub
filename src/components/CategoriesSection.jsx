import React from 'react';
import { Layers, Cpu, MonitorPlay, PenTool, Wrench, Gamepad2 } from 'lucide-react';

const categories = [
    { title: "Assinaturas", icon: <Layers size={32} />, color: "from-blue-600 to-blue-800" },
    { title: "Ferramentas IA", icon: <Cpu size={32} />, color: "from-purple-600 to-purple-800" },
    { title: "Streaming", icon: <MonitorPlay size={32} />, color: "from-red-600 to-red-800" },
    { title: "Edição & Design", icon: <PenTool size={32} />, color: "from-pink-600 to-pink-800" },
    { title: "Utilidades", icon: <Wrench size={32} />, color: "from-emerald-600 to-emerald-800" },
    { title: "Jogos / Keys", icon: <Gamepad2 size={32} />, color: "from-orange-600 to-orange-800" }
];

const CategoriesSection = () => {
    return (
        <section id="categorias" className="py-24 container">
            <div className="flex flex-col items-center mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nossas Categorias</h2>
                <p className="text-secondary max-w-2xl">Explore nossa seleção de produtos digitais organizados para você.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, index) => (
                    <div key={index} className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-border">
                        {/* Background with Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 z-10">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-lg">
                                {cat.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-wide group-hover:translate-y-1 transition-transform">
                                {cat.title}
                            </h3>
                        </div>

                        {/* Border Glow on Hover */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoriesSection;
