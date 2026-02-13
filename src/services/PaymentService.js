// Simulates interaction with a Payment Gateway (e.g., Mercado Pago, Efi)
export const PaymentService = {
    // Simulate creating a PIX payment
    createPayment: async (orderData) => {
        // In a real app, this would be a POST request to your backend
        // await axios.post('/api/pay', orderData);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: Math.floor(Math.random() * 1000000),
                    status: 'pending',
                    qr_code: "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540529.905802BR5913Axis Hub Ltd6008Brasilia62070503***6304E2CA",
                    qr_code_base64: "SimulatedBase64ImageString", // We will use qrcode.react to generate image from qr_code string
                    expires_at: new Date(Date.now() + 15 * 60000).toISOString() // 15 min expiration
                });
            }, 1000); // 1s delay
        });
    },

    // Simulate checking payment status
    checkStatus: async (paymentId) => {
        // In a real app, this would check your database updated by the Webhook
        return new Promise((resolve) => {
            // Randomly approve for demo purposes after a few simulated checks
            // For now, we just return pending, and maybe 'approved' if we trigger it manually or after time
            const isApproved = Math.random() > 0.8; // 20% chance to approve on check for demo fun? 
            // Better: Let's keep it pending until we force it or just keep it simple.
            // We will simulator "Approved" after 5 seconds in the component logic for the demo effect.
            resolve({
                id: paymentId,
                status: 'pending'
            });
        });
    }
};
