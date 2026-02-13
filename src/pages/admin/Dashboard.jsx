import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, LogOut, Package } from 'lucide-react';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await api.deleteProduct(id, token);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                alert('Erro ao excluir produto');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0E1117] flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0E1117] text-white p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0E1117] to-[#0E1117] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-[#111827]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-5 mb-4 md:mb-0">
                        <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-900/20">
                            <Package className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">Gerenciar Produtos</h1>
                            <p className="text-gray-400 mt-1">Total de <span className="text-blue-400 font-semibold">{products.length}</span> produtos cadastrados</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/admin/product/new')}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-900/20 active:scale-95"
                        >
                            <Plus className="w-5 h-5" /> Novo Produto
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-[#1F2937] hover:bg-[#374151] text-gray-300 hover:text-white px-5 py-3.5 rounded-xl transition-all border border-gray-700 hover:border-gray-600 active:scale-95"
                        >
                            <LogOut className="w-5 h-5" /> Sair
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-20 bg-[#111827]/50 rounded-3xl border border-white/5 border-dashed">
                        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400">Nenhum produto encontrado</h3>
                        <p className="text-gray-500 mt-2">Comece adicionando novos itens ao seu catálogo.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-[#111827] rounded-3xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1">
                                <div className="relative h-56 overflow-hidden bg-[#0B0D12]">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-60"></div>

                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <button
                                            onClick={() => navigate(`/admin/product/${product.id}`)}
                                            className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-blue-500 transition-colors border border-white/10"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-red-500 transition-colors border border-white/10"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-sm uppercase tracking-wider ${product.inStock
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                            }`}>
                                            {product.inStock ? 'Em Estoque' : 'Esgotado'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-bold text-lg mb-1 truncate text-white group-hover:text-blue-400 transition-colors" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <p className="text-xl font-bold text-gray-200">R$ {product.price}</p>
                                        {product.originalPrice && (
                                            <p className="text-xs text-gray-500 line-through">R$ {product.originalPrice}</p>
                                        )}
                                    </div>

                                    {product.onSale && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                                            <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wide">Promoção Ativa</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
