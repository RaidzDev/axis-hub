import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        description: '',
        image: '',
        inStock: true,
        onSale: false,
        features: [], // Handled as comma-separated string for simplicity
        variations: [] // Not implemented fully in this form yet for simplicity, or JSON input
    });

    const [featuresInput, setFeaturesInput] = useState('');

    useEffect(() => {
        if (isEditing) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            const products = await api.getProducts();
            const product = products.find(p => p.id === parseInt(id));
            if (product) {
                setFormData(product);
                setFeaturesInput(product.features ? product.features.join('\n') : '');
            }
        } catch (error) {
            console.error('Erro ao carregar produto');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('adminToken');

        // Convert features string back to array
        const productData = {
            ...formData,
            features: featuresInput.split('\n').filter(f => f.trim() !== '')
        };

        try {
            if (isEditing) {
                await api.updateProduct(parseInt(id), productData, token);
            } else {
                await api.addProduct(productData, token);
            }
            navigate('/admin/dashboard');
        } catch (error) {
            alert('Erro ao salvar produto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-secondary-800 p-2 rounded-xl hover:bg-secondary-700 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold">
                        {isEditing ? 'Editar Produto' : 'Novo Produto'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="space-y-6">
                        <div className="bg-secondary-800 p-6 rounded-2xl border border-secondary-700 space-y-4">
                            <h3 className="text-lg font-bold mb-4 border-b border-secondary-700 pb-2">Informações Básicas</h3>

                            <div>
                                <label className="block text-secondary-400 mb-2 text-sm">Nome do Produto</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-secondary-900 border border-secondary-700 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-secondary-400 mb-2 text-sm">Preço (R$)</label>
                                    <input
                                        type="text"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="29,90"
                                        className="w-full bg-secondary-900 border border-secondary-700 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-secondary-400 mb-2 text-sm">Preço Original (R$)</label>
                                    <input
                                        type="text"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleChange}
                                        placeholder="49,90"
                                        className="w-full bg-secondary-900 border border-secondary-700 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-secondary-400 mb-2 text-sm">Descrição</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-secondary-900 border border-secondary-700 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <div className="bg-secondary-800 p-6 rounded-2xl border border-secondary-700 space-y-4">
                            <h3 className="text-lg font-bold mb-4 border-b border-secondary-700 pb-2">Configurações</h3>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-secondary-600 bg-secondary-900 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-secondary-200">Em Estoque</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="onSale"
                                        checked={formData.onSale}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-secondary-600 bg-secondary-900 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-secondary-200">Em Promoção</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Media & Features */}
                    <div className="space-y-6">
                        <div className="bg-secondary-800 p-6 rounded-2xl border border-secondary-700 space-y-4">
                            <h3 className="text-lg font-bold mb-4 border-b border-secondary-700 pb-2">Imagem</h3>

                            <div>
                                <label className="block text-secondary-400 mb-2 text-sm">URL da Imagem</label>
                                <div className="flex gap-2">
                                    <div className="bg-secondary-900 p-3 rounded-xl">
                                        <ImageIcon className="text-secondary-500" />
                                    </div>
                                    <input
                                        type="url"
                                        name="image"
                                        required
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full bg-secondary-900 border border-secondary-700 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Image Preview */}
                            {formData.image && (
                                <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-secondary-700 bg-secondary-900">
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="bg-secondary-800 p-6 rounded-2xl border border-secondary-700 space-y-4">
                            <h3 className="text-lg font-bold mb-4 border-b border-secondary-700 pb-2">Características (Features)</h3>
                            <p className="text-xs text-secondary-400">Uma por linha</p>

                            <textarea
                                value={featuresInput}
                                onChange={(e) => setFeaturesInput(e.target.value)}
                                rows="6"
                                placeholder="Suporte 24/7&#10;Garantia de 30 dias&#10;..."
                                className="w-full bg-secondary-900 border border-secondary-700 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none resize-none font-mono text-sm"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Salvando...' : 'Salvar Produto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
