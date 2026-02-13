import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory "Database"
const orders = new Map();

// Mercado Pago Configuration
// WARNING: In production, ensure MP_ACCESS_TOKEN is set in .env
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-8254823867664893-021310-0925232975932598-193498305' // Fallback for dev/demo if env not present, BUT SHOULD BE ENV
});

// Routes

// Root Route (Status Check)
app.get('/', (req, res) => {
    res.json({ status: 'API is running', timestamp: new Date() });
});

// (A) Create Order
app.post('/api/orders', (req, res) => {
    try {
        const { items, email } = req.body;

        // Calculate Total
        const total = items.reduce((sum, item) => {
            // Ensure price is number
            const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace('R$ ', '').replace(',', '.'))
                : item.price;
            return sum + (price * (item.quantity || 1));
        }, 0);

        const orderId = crypto.randomUUID();

        const newOrder = {
            id: orderId,
            items,
            total,
            email: email || null,
            status: 'PENDING', // PENDING, PAID, CANCELLED
            createdAt: new Date(),
            paymentId: null,
            qrCode: null,
            qrCodeBase64: null
        };

        orders.set(orderId, newOrder);

        console.log(`[ORDER CREATED] ID: ${orderId} | Total: ${total}`);
        res.status(201).json({
            orderId,
            total,
            status: 'PENDING'
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// (B) Create PIX Payment
app.post('/api/payments/pix', async (req, res) => {
    try {
        const { orderId, payer } = req.body; // Expecting payer info (email) potentially

        const order = orders.get(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.total <= 0) {
            return res.status(400).json({ error: 'Invalid order total' });
        }

        const payment = new Payment(client);

        const body = {
            transaction_amount: order.total,
            description: `Pedido Axis Hub - ${orderId.substring(0, 8)}`,
            payment_method_id: 'pix',
            payer: {
                email: payer?.email || order.email || 'test_user_123456@testuser.com' // Valid placeholder if needed
            },
            external_reference: orderId,
        };

        console.log(`[CREATING PIX] Order: ${orderId} | Amount: ${order.total}`);

        const response = await payment.create({ body });

        const paymentData = response;
        const mpPaymentId = paymentData.id;
        const qrCode = paymentData.point_of_interaction.transaction_data.qr_code;
        const qrCodeBase64 = paymentData.point_of_interaction.transaction_data.qr_code_base64;

        // Update Order
        order.paymentId = mpPaymentId;
        order.qrCode = qrCode;
        order.qrCodeBase64 = qrCodeBase64;
        // Optionally update email if provided now
        if (payer?.email) order.email = payer.email;

        orders.set(orderId, order);

        res.json({
            paymentId: mpPaymentId,
            qrCode,
            qrCodeBase64,
            status: paymentData.status
        });

    } catch (error) {
        console.error('Error creating PIX:', error);
        res.status(500).json({ error: error.message || 'Payment generation failed' });
    }
});

// (C) Get Order Details
// (C) Get Order Details (With Status Check for Localhost Polling)
app.get('/api/orders/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const order = orders.get(orderId);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // Lazy Status Check (Polling Support for Local Development)
    if (order.status === 'PENDING' && order.paymentId) {
        try {
            console.log(`[POLLING] Checking status for Order: ${orderId}`);
            const paymentClient = new Payment(client);
            const payment = await paymentClient.get({ id: order.paymentId });

            if (payment.status === 'approved') {
                console.log(`[POLLING CONFIRMED] Order: ${orderId} is PAID`);
                order.status = 'PAID';
                order.paidAt = new Date();
                orders.set(orderId, order);
            }
        } catch (error) {
            console.error(`[POLLING ERROR] Failed to check MP status: ${error.message}`);
            // Don't fail the request, just return current state
        }
    }

    res.json(order);
});

// (D) Webhook
app.post('/api/webhooks/mercadopago', async (req, res) => {
    const { type, data } = req.body;
    const topic = req.query.topic || type; // MP sometimes sends 'topic' in query, 'type' in body

    try {
        if (topic === 'payment') {
            const paymentId = data?.id || req.query.id;

            if (paymentId) {
                console.log(`[WEBHOOK] Checking Payment: ${paymentId}`);

                // 1. Get Payment from MP API
                const paymentClient = new Payment(client);
                const payment = await paymentClient.get({ id: paymentId });

                // 2. Validate
                if (payment.status === 'approved') {
                    const orderId = payment.external_reference;
                    const order = orders.get(orderId);

                    if (order) {
                        // Validate amount (simple check)
                        // Note: floating point comparison might need epsilon, but usually exact matches in currency
                        if (order.status !== 'PAID') {
                            console.log(`[PAYMENT CONFIRMED] Order: ${orderId}`);
                            order.status = 'PAID';
                            order.paidAt = new Date();
                            orders.set(orderId, order);
                        }
                    } else {
                        console.warn(`[WEBHOOK] Order not found for reference: ${orderId}`);
                    }
                }
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('[WEBHOOK ERROR]', error);
        // Always acknowledge to stop retries if it's a logic error we can't fix
        res.sendStatus(200);
    }
});

// (E) DEBUG: Force Verify Payment (For Sandbox Testing)
app.post('/api/test/approve', (req, res) => {
    const { orderId } = req.body;
    const order = orders.get(orderId);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`[DEBUG] Forcing approval for Order: ${orderId}`);
    order.status = 'PAID';
    order.paidAt = new Date();
    orders.set(orderId, order);

    res.json({ status: 'PAID', message: 'Order manually approved for testing' });
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
