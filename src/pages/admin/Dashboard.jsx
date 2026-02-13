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

    if (loading) return <div className="min-h-screen bg-secondary-900 flex items-center justify-center text-white">Carregando...</div>;

    return (
        <div className="min-h-screen bg-secondary-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-secondary-800 p-6 rounded-2xl border border-secondary-700">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary-500/10 p-3 rounded-xl">
                            <Package className="w-8 h-8 text-primary-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
                            <p className="text-secondary-400">Total de {products.length} produtos cadastrados</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/admin/product/new')}
                            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
                        >
                            <Plus className="w-5 h-5" /> Novo Produto
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-secondary-700 hover:bg-secondary-600 px-4 py-3 rounded-xl text-secondary-300 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" /> Sair
                        </button>
                    </div>
                </div>

                {/* Product Grid/List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-secondary-800 rounded-2xl border border-secondary-700 overflow-hidden hover:border-primary-500/50 transition-colors group">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/product/${product.id}`)}
                                        className="bg-secondary-900/80 p-2 rounded-lg text-white hover:bg-primary-500 transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-secondary-900/80 p-2 rounded-lg text-white hover:bg-red-500 transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate" title={product.name}>{product.name}</h3>
                                <p className="text-primary-400 font-bold mb-2">R$ {product.price}</p>
                                <div className="flex gap-2 mt-3">
                                    <span className={`text-xs px-2 py-1 rounded-md border ${product.inStock ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                        {product.inStock ? 'Em Estoque' : 'Esgotado'}
                                    </span>
                                    {product.onSale && (
                                        <span className="text-xs px-2 py-1 rounded-md border bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                                            Promoção
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
