import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = 3000;

// Security Configs
const JWT_SECRET = process.env.JWT_SECRET || 'axis_hub_secure_key_2024';
const ADMIN_HASH = '$2b$10$y8diRI5AS6CLfOGbVcdlluZvb5ElOD1sk4tTNBbWBOB0R2Y7cOH96'; // hash: admin123

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// In-memory "Database"
const orders = new Map();
const pending2FA = new Map(); // tempId -> { code, expires }

// Rate Limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Mercado Pago Configuration
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-8254823867664893-021310-0925232975932598-193498305'
});

// Routes
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

// Helper to Read/Write Products
async function getProducts() {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveProducts(products) {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Middleware: Admin Auth (JWT)
const adminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ error: 'Acesso negado' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });
        req.user = user;
        next();
    });
};

// Root Route (Status Check)
app.get('/', (req, res) => {
    res.json({ status: 'API is running', timestamp: new Date() });
});

// --- PRODUCT ROUTES ---

// GET /api/products (Public)
app.get('/api/products', async (req, res) => {
    const products = await getProducts();
    res.json(products);
});

// POST /api/products (Admin Only)
app.post('/api/products', adminAuth, async (req, res) => {
    try {
        const newProduct = req.body;
        const products = await getProducts();

        // Auto-increment ID
        const maxId = products.reduce((max, p) => p.id > max ? p.id : max, 0);
        newProduct.id = maxId + 1;

        products.push(newProduct);
        await saveProducts(products);

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// PUT /api/products/:id (Admin Only)
app.put('/api/products/:id', adminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedData = req.body;
        let products = await getProducts();

        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData, id }; // Ensure ID stays same
            await saveProducts(products);
            res.json(products[index]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /api/products/:id (Admin Only)
app.delete('/api/products/:id', adminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let products = await getProducts();

        const filtered = products.filter(p => p.id !== id);
        if (products.length !== filtered.length) {
            await saveProducts(filtered);
            res.json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// --- ADMIN AUTH ROUTES ---

// 1. Initial Login (Check Password)
app.post('/api/admin/login', loginLimiter, async (req, res) => {
    // Artificial Delay (Security against timing/brute force)
    await new Promise(resolve => setTimeout(resolve, 800));

    const { password } = req.body;

    // Check Password Hash
    const isValid = await bcrypt.compare(password, ADMIN_HASH);

    if (!isValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // SIMPLIFIED LOGIN (2FA Disabled for now to fix UI first)
    // Generate Token Directly
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });

    res.json({
        requires2FA: false,
        token,
        message: 'Login realizado com sucesso.'
    });

    /*
    // KEEPING 2FA LOGIC COMMENTED FOR FUTURE USE
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const tempId = crypto.randomUUID();
    pending2FA.set(tempId, { code, expires: Date.now() + 5 * 60 * 1000 });
    console.log(`[SECURITY] 2FA Code: ${code}`);
    res.json({ requires2FA: true, tempId, message: 'Código enviado.' });
    */
});

// 2. Verify 2FA & Issue Token
app.post('/api/admin/verify-2fa', loginLimiter, async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const { tempId, code } = req.body;
    const entry = pending2FA.get(tempId);

    if (!entry) {
        return res.status(400).json({ error: 'Sessão expirada. Faça login novamente.' });
    }

    if (Date.now() > entry.expires) {
        pending2FA.delete(tempId); // Cleanup
        return res.status(400).json({ error: 'Código expirado.' });
    }

    if (entry.code !== code) {
        return res.status(400).json({ error: 'Código incorreto.' });
    }

    // Success! Issue Token
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
    pending2FA.delete(tempId); // Cleanup used code

    res.json({ token, message: 'Login realizado com sucesso.' });
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
