import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Check, Download, Info } from 'lucide-react';
import { api } from '../services/api';

const Success = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        api.getOrder(orderId).then(setOrder).catch(console.error);
    }, [orderId]);

    return (
        <div className="min-h-screen bg-background text-white flex flex-col">
            <Header />

            <main className="flex-grow pt-32 pb-20 flex flex-col items-center justify-center text-center container">
                <div className="max-w-xl mx-auto text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
                        <Check size={48} className="text-white" strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Pagamento Confirmado!</h1>
                    <p className="text-secondary text-lg mb-8">
                        Seu pedido #{orderId?.substring(0, 8)} foi processado com sucesso.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="btn-primary py-4 text-lg font-bold shadow-xl shadow-cta/20 flex items-center justify-center gap-2">
                            <Download size={20} /> Baixar/Acessar Produto
                        </button>
                        <Link to="/" className="btn-secondary py-4 border-border hover:border-primary/50 text-gray-300 flex items-center justify-center gap-2">
                            Voltar para a Loja
                        </Link>
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-surface/50 border border-border text-left">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Info size={18} className="text-primary" /> Próximos Passos
                        </h3>
                        <ul className="text-sm text-secondary space-y-2 list-disc list-inside">
                            <li>Verifique sua caixa de entrada e spam ({order?.email || 'seu e-mail'}).</li>
                            <li>Se for um software, o link de download e a chave de licença estão no e-mail.</li>
                            <li>Precisa de ajuda? Acesse nosso Suporte no menu.</li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Success;
