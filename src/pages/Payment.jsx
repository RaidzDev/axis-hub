import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Info, ShieldCheck, Download, Loader2, AlertCircle } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const Payment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    // Initial Load & Polling
    useEffect(() => {
        let isMounted = true;
        let pollInterval;

        const checkStatus = async () => {
            try {
                const data = await api.getOrder(orderId);

                if (isMounted) {
                    setOrderData(data);
                    setLoading(false);

                    // If Paid, redirect
                    if (data.status === 'PAID') {
                        navigate(`/success/${orderId}`);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error checking status:', err);
                    setError('Erro ao carregar dados do pagamento.');
                    setLoading(false);
                }
            }
        };

        // First check
        checkStatus();

        // Poll every 5s
        pollInterval = setInterval(checkStatus, 5000);

        return () => {
            isMounted = false;
            clearInterval(pollInterval);
        };
    }, [orderId, navigate]);

    const handleCopy = () => {
        if (orderData?.qrCode) {
            navigator.clipboard.writeText(orderData.qrCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading && !orderData) {
        return (
            <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p>Carregando pagamento...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background text-white flex flex-col">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center container pt-32 pb-20 text-center">
                    <AlertCircle className="text-red-500 mb-4" size={48} />
                    <h1 className="text-2xl font-bold mb-2">Ops! Algo deu errado.</h1>
                    <p className="text-secondary mb-6">{error}</p>
                    <Link to="/" className="btn-primary px-6 py-3">Voltar para Início</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white flex flex-col">
            <Header />

            <main className="flex-grow pt-32 pb-20">
                <div className="container max-w-4xl">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        <div className="lg:col-span-7 space-y-8 animate-fade-in-up">

                            <div className="mb-6">
                                <h1 className="text-3xl font-bold mb-2">Concluir pagamento</h1>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="text-green-500 font-bold flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Aguardando pagamento...
                                    </span>
                                    <span>•</span>
                                    <span>Vence em 30 minutos</span>
                                </div>
                            </div>

                            <div className="card-surface p-8 text-center border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden">
                                {/* background grid effect */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                                </div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="bg-white p-4 rounded-xl mb-6 shadow-xl">
                                        {/* Prefer Base64 Image from MP if available, else render text */}
                                        {orderData.qrCodeBase64 ? (
                                            <img
                                                src={`data:image/png;base64,${orderData.qrCodeBase64}`}
                                                alt="QR Code Pix"
                                                className="w-[220px] h-[220px]"
                                            />
                                        ) : (
                                            <QRCodeSVG
                                                value={orderData.qrCode || ''}
                                                size={220}
                                                level={"M"}
                                                imageSettings={{
                                                    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_—_Pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg",
                                                    x: undefined,
                                                    y: undefined,
                                                    height: 24,
                                                    width: 24,
                                                    excavate: true,
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div className="w-full max-w-sm">
                                        <label className="block text-xs text-secondary mb-2 text-left uppercase font-bold tracking-wider">Código Pix Copia e Cola</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={orderData.qrCode || ''}
                                                readOnly
                                                className="flex-1 bg-background border border-border rounded-lg px-3 text-xs text-gray-400 outline-none font-mono truncate"
                                            />
                                            <button
                                                onClick={handleCopy}
                                                className={`px-4 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${copied
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-cta hover:bg-yellow-500 text-white shadow-lg shadow-cta/20'
                                                    }`}
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                                {copied ? 'Copiado!' : 'Copiar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="space-y-4">
                                <div className="bg-surface border border-border rounded-xl p-6">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Info size={18} /> Como pagar com PIX?
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                                            <div>
                                                <h4 className="font-bold text-gray-300">Abra o app do seu banco</h4>
                                                <p className="text-sm text-secondary">Acesse a área Pix no aplicativo do seu banco preferido.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                                            <div>
                                                <h4 className="font-bold text-gray-300">Escolha "Pagar com QR Code" ou "Pix Copia e Cola"</h4>
                                                <p className="text-sm text-secondary">Escaneie o código acima ou cole o código copiado.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                                            <div>
                                                <h4 className="font-bold text-gray-300">Confirme o pagamento</h4>
                                                <p className="text-sm text-secondary">O sistema identificará seu pagamento automaticamente.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border text-center text-sm text-secondary">
                                        Após o pagamento, o pedido será processado automaticamente.
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Sidebar Summary */}
                        <div className="lg:col-span-5">
                            <div className="card-surface p-6 rounded-2xl border border-border sticky top-32">
                                <h3 className="text-lg font-bold mb-6 pb-4 border-b border-border">Detalhes do Pedido</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-secondary">
                                        <span>Pedido #</span>
                                        <span className="text-white font-mono">{orderId.substring(0, 8)}</span>
                                    </div>
                                    <div className="flex justify-between text-secondary">
                                        <span>Valor Total</span>
                                        <span className="text-white font-bold text-lg">R$ {orderData.total.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-3 text-sm text-green-400 mb-6">
                                    <ShieldCheck className="flex-shrink-0" size={20} />
                                    <span>Ambiente seguro. Seus dados estão protegidos.</span>
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-4">Problemas com o pagamento?</p>
                                    <button className="text-primary text-sm font-bold hover:underline">
                                        Falar com Suporte
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Payment;
