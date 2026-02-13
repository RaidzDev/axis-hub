import fetch from 'node-fetch';

const baseUrl = 'http://localhost:3000/api';
const ADMIN_TOKEN = 'Bearer ADMIN_SECRET_123';

async function testProducts() {
    console.log('--- Testing Product API ---');

    // 1. Login
    console.log('\n1. Login Admin...');
    const loginRes = await fetch(`${baseUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'admin123' })
    });
    console.log('Login:', await loginRes.json());

    // 2. Get Products
    console.log('\n2. Get Products...');
    const getRes = await fetch(`${baseUrl}/products`);
    const products = await getRes.json();
    console.log(`Found ${products.length} products`);

    // 3. Add Product
    console.log('\n3. Add Product...');
    const addRes = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ADMIN_TOKEN
        },
        body: JSON.stringify({
            name: 'API Test Product',
            price: '99.99',
            description: 'Created via API'
        })
    });
    const newProduct = await addRes.json();
    console.log('Added:', newProduct);

    // 4. Delete Product
    if (newProduct.id) {
        console.log(`\n4. Delete Product ${newProduct.id}...`);
        const delRes = await fetch(`${baseUrl}/products/${newProduct.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': ADMIN_TOKEN }
        });
        console.log('Delete:', await delRes.json());
    }
}

testProducts();
