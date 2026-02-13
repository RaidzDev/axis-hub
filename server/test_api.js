import fetch from 'node-fetch'; // Might need to just use global fetch if node > 18

// Node 18+ has fetch globally
const baseUrl = 'http://localhost:3000/api';

async function test() {
    console.log('--- Testing API ---');

    try {
        // 1. Create Order
        console.log('1. Creating Order...');
        const orderRes = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: [{ id: 999, name: 'Test', price: 1.00, quantity: 1 }],
                email: 'test_script@test.com'
            })
        });

        const orderData = await orderRes.json();
        console.log('Order Response:', orderData);

        if (!orderData.orderId) {
            console.error('Failed to create order');
            return;
        }

        // 2. Create Payment
        console.log('2. Creating PIX Payment...');
        const paymentRes = await fetch(`${baseUrl}/payments/pix`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderData.orderId,
                payer: { email: 'payer@test.com' }
            })
        });

        const paymentText = await paymentRes.text();
        console.log('Payment Response Raw:', paymentText);

        try {
            const paymentData = JSON.parse(paymentText);
            console.log('Payment Response JSON:', paymentData);
        } catch (e) {
            console.error('Failed to parse payment JSON');
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
}

test();
