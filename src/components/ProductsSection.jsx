import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const ProductsSection = ({ products = [] }) => {
    const [filter, setFilter] = useState('Todos');
    const filters = ['Todos', 'Populares', 'Novidades', 'Ofertas'];

    // If products is null/undefined during loading, default to empty array
    const displayProducts = products || [];

    return (
        <section id="produtos" className="py-20 bg-background">
            <div className="container">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            Produtos em <span className="text-primary">Destaque</span>
                        </h2>
                        <p className="text-secondary max-w-xl">
                            Aproveite nossas ofertas exclusivas com entrega imediata e garantia total.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${filter === f
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-surface border-border text-secondary hover:border-gray-700 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayProducts.map(product => (
                        <Link to={`/produto/${product.id}`} key={product.id}>
                            <ProductCard product={product} />
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="btn-secondary px-8 py-3 rounded-xl border border-border text-secondary hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all font-bold">
                        Ver todos os produtos
                    </button>
                </div>

            </div>
        </section>
    );
};

export default ProductsSection;
