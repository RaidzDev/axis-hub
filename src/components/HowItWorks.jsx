import React from 'react';
import { ShoppingCart, CreditCard, Unlock } from 'lucide-react';

const steps = [
    {
        id: 1,
        icon: <ShoppingCart size={32} />,
        title: 'Escolha o Produto',
        description: 'Navegue pelo nosso catálogo e adicione o software ou assinatura desejada ao carrinho.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20'
    },
    {
        id: 2,
        icon: <CreditCard size={32} />,
        title: 'Finalize o Pagamento',
        description: 'Pague com segurança via PIX ou Cartão. Processamento imediato e automático.',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20'
    },
    {
        id: 3,
        icon: <Unlock size={32} />,
        title: 'Receba o Acesso',
        description: 'Sua licença ou dados de acesso são enviados automaticamente para seu e-mail e WhatsApp.',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20'
    }
];

const HowItWorks = () => {
    return (
        <section id="como-funciona" className="py-20 bg-[#0B0D12]">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Como <span className="text-blue-500">Funciona</span>?
                    </h2>
                    <p className="text-gray-400">
                        Processo simplificado para você ter acesso ao que precisa em instantes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative group">
                            {/* Connector line for desktop */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-800 -z-10"></div>
                            )}

                            <div className="bg-[#111827] p-8 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all text-center group-hover:-translate-y-2 group-hover:shadow-xl">
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${step.bg} ${step.color} border ${step.border} group-hover:scale-110 transition-transform`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
