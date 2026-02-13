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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
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
            alert('Erro ao salvar produto. Verifique se a imagem não é muito grande.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0E1117] text-white p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0E1117] to-[#0E1117] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-[#1F2937] p-3 rounded-xl hover:bg-[#374151] transition-all text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 shadow-lg active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                            {isEditing ? 'Editar Produto' : 'Novo Produto'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Preencha os dados abaixo para {isEditing ? 'atualizar' : 'cadastrar'} um item no catálogo.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info (2 cols wide) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#111827] p-8 rounded-3xl border border-white/5 shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                <h3 className="text-lg font-bold text-gray-200">Informações Básicas</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-400 mb-2 text-xs font-semibold uppercase tracking-wider ml-1">Nome do Produto</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-[#0B0D12] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                        placeholder="Ex: Licença Vitalícia Premium"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 mb-2 text-xs font-semibold uppercase tracking-wider ml-1">Preço (R$)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                                            <input
                                                type="text"
                                                name="price"
                                                required
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="0,00"
                                                className="w-full bg-[#0B0D12] border border-gray-700 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2 text-xs font-semibold uppercase tracking-wider ml-1">Preço Original (R$)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                                            <input
                                                type="text"
                                                name="originalPrice"
                                                value={formData.originalPrice}
                                                onChange={handleChange}
                                                placeholder="0,00"
                                                className="w-full bg-[#0B0D12] border border-gray-700 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2 text-xs font-semibold uppercase tracking-wider ml-1">Descrição Detalhada</label>
                                    <textarea
                                        name="description"
                                        rows="5"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full bg-[#0B0D12] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner resize-none leading-relaxed"
                                        placeholder="Descreva as principais funcionalidades e benefícios deste produto..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111827] p-8 rounded-3xl border border-white/5 shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                                <h3 className="text-lg font-bold text-gray-200">Características (Features)</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-3 ml-1">Escreva uma característica por linha. Elas aparecerão como lista no card do produto.</p>

                            <textarea
                                value={featuresInput}
                                onChange={(e) => setFeaturesInput(e.target.value)}
                                rows="6"
                                placeholder="✓ Entrega Imediata&#10;✓ Suporte 24/7&#10;✓ Garantia Estendida"
                                className="w-full bg-[#0B0D12] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all shadow-inner resize-none font-mono text-sm leading-relaxed"
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Column - Media & Settings (1 col wide) */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-[#111827] p-6 rounded-3xl border border-white/5 shadow-xl">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Status & Visibilidade</h3>

                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-3 rounded-xl bg-[#0B0D12] border border-gray-800 cursor-pointer hover:border-gray-700 transition-colors group">
                                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">Em Estoque</span>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                        <input
                                            type="checkbox"
                                            name="inStock"
                                            checked={formData.inStock}
                                            onChange={handleChange}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 checked:right-0 right-6 checked:border-blue-500"
                                        />
                                        <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${formData.inStock ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between p-3 rounded-xl bg-[#0B0D12] border border-gray-800 cursor-pointer hover:border-gray-700 transition-colors group">
                                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">Promoção Ativa</span>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                        <input
                                            type="checkbox"
                                            name="onSale"
                                            checked={formData.onSale}
                                            onChange={handleChange}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 checked:right-0 right-6 checked:border-yellow-500"
                                        />
                                        <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${formData.onSale ? 'bg-yellow-600' : 'bg-gray-700'}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Image Card */}
                        <div className="bg-[#111827] p-6 rounded-3xl border border-white/5 shadow-xl">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Imagem de Capa</h3>

                            <div className="space-y-4">
                                {/* Image Preview Block */}
                                <div className={`aspect-video rounded-2xl overflow-hidden border-2 border-dashed relative group transition-all ${formData.image ? 'border-blue-500/50 bg-[#0B0D12]' : 'border-gray-700 bg-[#0B0D12] hover:border-gray-600'
                                    }`}>
                                    {formData.image ? (
                                        <>
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                <ImageIcon className="w-8 h-8 mb-2 opacity-80" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Alterar Imagem</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-400 transition-colors">
                                            <div className="bg-gray-800/50 p-4 rounded-full mb-2">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-semibold">Nenhuma imagem selecionada</span>
                                        </div>
                                    )}

                                    {/* Invisible File Input Overlay */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        title="Clique para fazer upload"
                                    />
                                </div>

                                <div className="text-center">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-widest px-2 bg-[#111827] relative z-10">OU</span>
                                    <div className="border-t border-gray-800 -mt-2.5 mb-4"></div>
                                </div>

                                <div>
                                    <label className="block text-gray-500 mb-1.5 text-[10px] font-bold uppercase tracking-wider">URL da Imagem</label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full bg-[#0B0D12] text-xs border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 border border-blue-500/50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
