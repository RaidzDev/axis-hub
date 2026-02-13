// Use VITE_API_URL if set (production), otherwise fallback to localhost
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
    baseUrl: `${BACKEND_URL}/api`,

    createOrder: async (items, email) => {
        const response = await fetch(`${api.baseUrl}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, email })
        });
        if (!response.ok) throw new Error('Falha ao criar pedido');
        return response.json();
    },

    getOrder: async (orderId) => {
        const response = await fetch(`${api.baseUrl}/orders/${orderId}`);
        if (!response.ok) throw new Error('Pedido não encontrado');
        return response.json();
    },

    createPixPayment: async (orderId, payer) => {
        const response = await fetch(`${api.baseUrl}/payments/pix`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, payer }) // Pass payer info (email)
        });
        if (!response.ok) throw new Error('Falha ao gerar PIX');
        return response.json();
    },

    // --- Admin & Products ---

    adminLogin: async (password) => {
        const response = await fetch(`${api.baseUrl}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        if (!response.ok) throw new Error('Falha no login');
        return response.json();
    },

    getProducts: async () => {
        const response = await fetch(`${api.baseUrl}/products`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        return response.json();
    },

    addProduct: async (product, token) => {
        const response = await fetch(`${api.baseUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Erro ao adicionar produto');
        return response.json();
    },

    updateProduct: async (id, product, token) => {
        const response = await fetch(`${api.baseUrl}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Erro ao atualizar produto');
        return response.json();
    },

    deleteProduct: async (id, token) => {
        const response = await fetch(`${api.baseUrl}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Erro ao remover produto');
        return response.json();
    }
};
