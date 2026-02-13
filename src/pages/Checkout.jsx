import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, CreditCard, ChevronRight, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

const Checkout = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderIdParam = searchParams.get('orderId');

    const [isLoading, setIsLoading] = useState(!!orderIdParam);
    const [apiOrder, setApiOrder] = useState(null);
    const [payerName, setPayerName] = useState('');
    const [payerEmail, setPayerEmail] = useState('');

    // Load Order if orderId present
    useEffect(() => {
        if (orderIdParam) {
            const loadOrder = async () => {
                try {
                    const data = await api.getOrder(orderIdParam);
                    setApiOrder(data);
                } catch (error) {
                    console.error('Error loading order:', error);
                    alert('Erro ao carregar pedido.');
                } finally {
                    setIsLoading(false);
                }
            };
            loadOrder();
        }
    }, [orderIdParam]);


    // Determine Price and Items source (API or Cart)
    const effectiveItems = apiOrder ? apiOrder.items : cart;
    const effectiveTotal = apiOrder ? apiOrder.total : cartTotal;

    // Discount logic (Simulated for Pix)
    const discount = 0; // Backend handles total usually, or we apply visual discount. Backend route calculated based on item price.
    // For simplicity, let's assume the API returned total matches the visual total we want.
    // If we want visually apply 5% discount, we should have done it in backend or do it here visually.
    // Let's stick to API total for consistency with backend payment creation.

    // If we want to show "5% OFF", we should ensure backend PIX transaction amount reflects it if we change it here.
    // For now, let's treat effectiveTotal as the final amount to pay.

    const handlePayment = async () => {
        if (!payerEmail || !payerName) {
            alert('Por favor, preencha nome e e-mail.');
            return;
        }

        setIsLoading(true);
        try {
            let targetOrderId = orderIdParam;

            // If no orderId (using Cart), create order first
            if (!targetOrderId) {
                const orderData = await api.createOrder(cart, payerEmail);
                targetOrderId = orderData.orderId;
            }

            // Create Pix Payment
            // Pass payer info to backend to update order/MP
            await api.createPixPayment(targetOrderId, { email: payerEmail, first_name: payerName });

            // Navigate to Payment Page
            navigate(`/pix/${targetOrderId}`);

        } catch (error) {
            console.error('Payment Error:', error);
            alert('Erro ao processar pagamento.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !apiOrder && orderIdParam) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-white"><Loader2 className="animate-spin" size={48} /></div>;
    }

    if (effectiveItems.length === 0 && !isLoading) {
        return (
            <div className="min-h-screen bg-background text-white flex flex-col">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center container pt-32 pb-20">
                    <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
                    <p className="text-secondary mb-8">Escolha um produto para continuar.</p>
                    <Link to="/" className="btn-primary px-8 py-3">Voltar para a Loja</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white flex flex-col">
            <Header />

            <main className="flex-grow pt-32 pb-20">
                <div className="container max-w-6xl">

                    <div className="mb-10">
                        <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Link to="/" className="hover:text-white transition-colors">Início</Link>
                            <ChevronRight size={14} />
                            <span className="text-white">Checkout</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left Column: Form */}
                        <div className="lg:col-span-2 space-y-8 animate-fade-in-up">

                            {/* Payment Info */}
                            <div className="card-surface p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">1</div>
                                    <h2 className="text-xl font-bold">Forma de Pagamento</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary bg-primary/10 text-white transition-all shadow-lg shadow-primary/5">
                                        <div className="font-bold">PIX (Instantâneo)</div>
                                        <span className="ml-auto text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded font-bold">-5% OFF</span>
                                    </button>
                                    <button className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-gray-700 bg-surface transition-all opacity-60 cursor-not-allowed">
                                        <CreditCard size={20} />
                                        <div className="font-medium">Cartão de Crédito</div>
                                        <span className="ml-auto text-xs text-gray-500">Em breve</span>
                                    </button>
                                </div>

                                <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg flex items-start gap-3">
                                    <ShieldCheck className="text-primary w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-200/80">Pagamento processado em ambiente seguro com criptografia de ponta a ponta. Liberação imediata.</p>
                                </div>
                            </div>

                            {/* Personal Info */}
                            <div className="card-surface p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold border border-gray-600">2</div>
                                    <h2 className="text-xl font-bold">Dados de Contato</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Nome Completo</label>
                                        <input
                                            type="text"
                                            className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                                            placeholder="Seu nome"
                                            value={payerName}
                                            onChange={(e) => setPayerName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">E-mail (para recebimento)</label>
                                        <input
                                            type="email"
                                            className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                                            placeholder="seu@email.com"
                                            value={payerEmail}
                                            onChange={(e) => setPayerEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-start gap-3">
                                    <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-gray-700 bg-background text-primary focus:ring-offset-0 focus:ring-primary" defaultChecked />
                                    <label htmlFor="terms" className="text-sm text-secondary">
                                        Li e aceito os <a href="#" className="text-primary hover:underline">Termos de Uso</a> e <a href="#" className="text-primary hover:underline">Política de Privacidade</a>.
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isLoading}
                                className="w-full md:hidden btn-primary py-4 text-lg font-bold shadow-xl shadow-cta/20 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Pagar R$ {effectiveTotal.toFixed(2).replace('.', ',')}</>}
                            </button>

                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card-surface p-6 rounded-2xl border border-border sticky top-32">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                                    <h3 className="text-lg font-bold">Resumo do Pedido</h3>
                                    <div className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                        <Lock size={10} /> Seguro
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {effectiveItems.map((item, index) => (
                                        <div key={`${item.id}-${index}`} className="flex gap-4 group">
                                            <div className="w-16 h-16 bg-background rounded-lg flex-shrink-0 overflow-hidden border border-border">
                                                {/* Fallback image */}
                                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-500">Img</div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-medium text-sm line-clamp-2 text-gray-200">{item.name}</h4>
                                                    {!apiOrder && (
                                                        <button onClick={() => removeFromCart(index)} className="text-gray-600 hover:text-red-500 transition-colors p-1">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="font-bold text-sm">R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}</div>
                                                    <div className="flex items-center gap-2 bg-background rounded-lg border border-border px-1">
                                                        {!apiOrder ? (
                                                            <>
                                                                <button onClick={() => updateQuantity(index, -1)} className="p-1 hover:text-primary transition-colors"><Minus size={12} /></button>
                                                                <span className="text-xs w-4 text-center">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(index, 1)} className="p-1 hover:text-primary transition-colors"><Plus size={12} /></button>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs w-4 text-center text-gray-400">x{item.quantity}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 py-4 border-t border-border text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>R$ {effectiveTotal.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <div className="flex justify-between text-green-500">
                                        <span>Desconto PIX</span>
                                        <span>- 0,00</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
                                        <span className="font-bold text-lg text-white">Total</span>
                                        <span className="font-bold text-2xl text-primary">R$ {effectiveTotal.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={isLoading}
                                    className="w-full hidden md:flex bg-cta hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cta/20 transition-all active:scale-95 items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Pagar R$ {effectiveTotal.toFixed(2).replace('.', ',')}</>}
                                </button>

                                <div className="mt-6 flex justify-center gap-4 opacity-30 grayscale">
                                    <CreditCard size={24} />
                                    <ShieldCheck size={24} />
                                    <Lock size={24} />
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

export default Checkout;
