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
    }
};
