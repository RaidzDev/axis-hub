import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, Zap, CreditCard, Check, AlertTriangle, ArrowRight, Star } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [allProducts, setAllProducts] = useState([]); // Needed for "Similar Products"

    const { buyNow, addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const products = await api.getProducts();
                setAllProducts(products);

                const found = products.find(p => p.id == id);
                if (found) {
                    setProduct(found);
                    if (found.variations && found.variations.length > 0) {
                        setSelectedVariation(found.variations[0].id);
                    }
                }
            } catch (error) {
                console.error('Error loading product:', error);
            }
        };
        loadData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleBuyNow = async () => {
        if (product && product.inStock) {
            try {
                // Determine price based on variation
                let finalPrice = product.price;
                let finalName = product.name;

                if (selectedVariation) {
                    const variation = product.variations.find(v => v.id === selectedVariation);
                    if (variation) {
                        finalPrice = variation.price;
                        finalName = `${product.name} - ${variation.name}`;
                    }
                }

                // Create Order API
                const orderData = await api.createOrder([{
                    id: product.id,
                    name: finalName,
                    price: finalPrice,
                    quantity: 1
                }]);

                // Navigate to Checkout with Order ID
                navigate(`/checkout?orderId=${orderData.orderId}`);
            } catch (error) {
                console.error('Error creating order:', error);
                alert('Erro ao processar compra. Tente novamente.');
            }
        }
    };

    const handleAddToCart = () => {
        if (product && product.inStock) {
            addToCart(product, selectedVariation);
            alert('Produto adicionado ao carrinho!');
        }
    };

    if (!product) {
        return <div className="min-h-screen bg-background text-white flex items-center justify-center">Carregando...</div>;
    }

    const similarProducts = allProducts.filter(p => p.id != id).slice(0, 4);

    return (
        <div className="min-h-screen bg-background text-white">
            <Header />

            <main className="container pt-32 pb-20">

                {/* Top Section: 3 Columns Desktop / 2 Tablet / 1 Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 animate-fade-in-up">

                    {/* Col 1: Image (Desktop 6/12 - 50%) */}
                    <div className="lg:col-span-6">
                        <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-surface border border-border group">
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Col 2: Details (Desktop 4/12 - 33%) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div>
                            <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold mb-4 border ${product.inStock
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                {product.inStock ? 'EM ESTOQUE' : 'ESGOTADO'}
                            </span>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-secondary">
                                <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor" /> 4.9</span>
                                <span>•</span>
                                <span>Entrega Digital</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-surface/50 border border-border">
                            <span className="text-sm text-secondary line-through">R$ {product.originalPrice}</span>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-white">R$ {product.price}</span>
                                <span className="text-sm text-green-500 font-medium mb-1">à vista no Pix</span>
                            </div>
                        </div>

                        {/* Variations / Plans Selection */}
                        {product.variations && product.variations.length > 0 && (
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    Escolha seu plano:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {product.variations.map(variation => (
                                        <div
                                            key={variation.id}
                                            onClick={() => setSelectedVariation(variation.id)}
                                            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${selectedVariation === variation.id
                                                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                                                    : 'bg-surface border-border hover:border-gray-500 hover:bg-surface/80'
                                                }`}
                                        >
                                            {/* Selection Indicator */}
                                            <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedVariation === variation.id
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-gray-600 bg-transparent'
                                                }`}>
                                                {selectedVariation === variation.id && <Check size={12} strokeWidth={4} />}
                                            </div>

                                            <div className="flex flex-col h-full justify-between gap-2">
                                                <div>
                                                    <h3 className={`font-bold text-lg mb-1 ${selectedVariation === variation.id ? 'text-white' : 'text-gray-300'}`}>
                                                        {variation.name}
                                                    </h3>
                                                    {/* Optional: Add description logic per variation if available */}
                                                </div>

                                                <div className="pt-3 border-t border-white/5 mt-1">
                                                    <span className="text-sm text-gray-400">Total</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xs text-primary font-bold">R$</span>
                                                        <span className={`text-2xl font-bold tracking-tight ${selectedVariation === variation.id ? 'text-primary' : 'text-white'}`}>
                                                            {parseFloat(variation.price).toFixed(2).replace('.', ',')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 mt-4">
                            <button onClick={handleBuyNow} className="btn-primary w-full py-4 text-lg shadow-xl shadow-cta/10">
                                Comprar Agora
                            </button>
                            <button onClick={handleAddToCart} className="btn-secondary w-full py-4 border-border hover:border-primary/50 text-gray-300">
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>

                    {/* Col 3: Trust Badges (Desktop 2/12 - ~17%) - Stacks below on mobile/tablet */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center text-center gap-2 hover:border-primary/30 transition-colors">
                            <Zap className="text-blue-500" size={24} />
                            <span className="text-xs font-bold text-white">Entrega Imediata</span>
                            <span className="text-[10px] text-secondary leading-tight">Receba no e-mail após o pagamento</span>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center text-center gap-2 hover:border-green-500/30 transition-colors">
                            <ShieldCheck className="text-green-500" size={24} />
                            <span className="text-xs font-bold text-white">Segurança Total</span>
                            <span className="text-[10px] text-secondary leading-tight">Site criptografado e seguro</span>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center text-center gap-2 hover:border-yellow-500/30 transition-colors">
                            <CreditCard className="text-yellow-500" size={24} />
                            <span className="text-xs font-bold text-white">Pagamento Pix</span>
                            <span className="text-[10px] text-secondary leading-tight">Aprovação instantânea 24/7</span>
                        </div>
                    </div>

                </div>

                {/* Description & Features */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description Block */}
                        <div className="card-surface p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Descrição do Produto</h2>
                            <p className="text-secondary leading-relaxed mb-8">
                                {product.description}
                            </p>

                            {/* Features List */}
                            {product.features && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {product.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                            <span className="text-gray-300 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Alert Box */}
                        <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/20 flex items-start gap-4">
                            <AlertTriangle className="text-orange-500 shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-bold text-orange-500 mb-1">Informações Importantes</h3>
                                <ul className="text-sm text-secondary space-y-1 list-disc list-inside">
                                    <li>O envio é automático após a confirmação do pagamento.</li>
                                    <li>Verifique sua caixa de spam/lixo eletrônico.</li>
                                    <li>Suporte técnico disponível todos os dias das 08h às 22h.</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Similar Products */}
                <div className="border-t border-border pt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Produtos Similares</h2>
                        <Link to="/" className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            Ver todos <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarProducts.map(p => (
                            <Link to={`/produto/${p.id}`} key={p.id} onClick={() => window.scrollTo(0, 0)}>
                                <ProductCard product={p} />
                            </Link>
                        ))}
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default ProductDetails;
