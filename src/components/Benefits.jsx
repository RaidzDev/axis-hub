import React from 'react';
import { Star, Zap, ShieldCheck } from 'lucide-react';

const Benefits = () => {
    const benefits = [
        {
            icon: <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />,
            title: "4.9/5 Avaliações",
            description: "Clientes satisfeitos",
            bg: "bg-yellow-500/10"
        },
        {
            icon: <Zap className="w-6 h-6 text-blue-500" fill="currentColor" />,
            title: "Entrega Digital",
            description: "Envio imediato no e-mail",
            bg: "bg-blue-500/10"
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-green-500" fill="currentColor" />,
            title: "Compra Segura",
            description: "Proteção total SSL",
            bg: "bg-green-500/10"
        }
    ];

    return (
        <section className="container relative z-20 -mt-12 px-4">
            <div className="bg-surface border border-border rounded-2xl shadow-2xl p-0 overflow-hidden backdrop-blur-md">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                    {benefits.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-6 hover:bg-white/5 transition-colors group">
                            <div className={`p-3 rounded-xl ${item.bg} group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                <p className="text-sm text-secondary font-medium uppercase tracking-wide">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
