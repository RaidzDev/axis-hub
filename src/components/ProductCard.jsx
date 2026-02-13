import React from 'react';
import { Shield, Check, ShoppingBag, Zap, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    // Navigation to PDP is handled by the parent Link component
    // BUT we need to intercept "Comprar" if we want "Buy Now" behavior directly from card?
    // User request 3.2: "Ao clicar 'Comprar agora' em qualquer card: criar order... navegar para /checkout?orderId=XXXX"
    // Previously we removed onClick to go to PDP. Now we must Restore it but with API logic.

    const handleBuyNow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product.inStock) return;

        try {
            // Create Order
            const orderData = await api.createOrder([{
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            }]);

            // Navigate to Checkout with Order ID
            navigate(`/checkout?orderId=${orderData.orderId}`);
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Erro ao iniciar compra. Tente novamente.');
        }
    };


    return (
        <div className="group relative card-surface overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full">

            {/* Image Area */}
            <div className="relative h-48 overflow-hidden bg-surface">
                {/* Fallback pattern if no image */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-500"></div>

                {product.image && (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                )}

                <div className="absolute top-3 left-3 z-20">
                    {product.onSale && (
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">
                            -50% OFF
                        </span>
                    )}
                </div>
                <div className="absolute top-3 right-3 z-20">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md border ${product.inStock
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                        {product.inStock ? 'EM ESTOQUE' : 'ESGOTADO'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                            <Zap size={10} fill="currentColor" /> Entrega Digital
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2 min-h-[56px]">
                        {product.name}
                    </h3>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-xs text-secondary">
                        <Check size={12} className="text-green-500" /> Suporte Premium
                    </div>
                    <div className="flex items-center gap-2 text-xs text-secondary">
                        <Check size={12} className="text-green-500" /> Ativação Imediata
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                    <div>
                        <span className="block text-xs text-secondary line-through">R$ {product.originalPrice}</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-bold text-white">R$ {product.price}</span>
                        </div>
                    </div>

                    <div
                        onClick={handleBuyNow}
                        className={`btn-primary px-4 py-2 text-sm flex items-center gap-2 cursor-pointer ${!product.inStock && 'opacity-50 cursor-not-allowed grayscale pointer-events-none'}`}
                    >
                        {product.inStock ? 'Comprar' : 'Indisponível'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
