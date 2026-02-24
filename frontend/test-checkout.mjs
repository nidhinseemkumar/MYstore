import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read env variables
const dotEnvPath = path.resolve('.env');
let envFile = '';
try {
    envFile = fs.readFileSync(dotEnvPath, 'utf8');
} catch (e) {
    console.log("No .env file found");
}
const env = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1]] = match[2];
});

const url = env.VITE_SUPABASE_URL || 'REPLACE_ME';
const key = env.VITE_SUPABASE_ANON_KEY || 'REPLACE_ME';

if (!url || !key) {
    console.log("Missing credentials");
    process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
    // Login as admin or buyer to test
    // Since we don't know the password, let's just create a new test user
    const email = `test_${Date.now()}@example.com`;
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: 'password123',
        options: { data: { full_name: 'Test Buyer', role: 'buyer' } }
    });

    if (authError) {
        console.log("Auth Error:", authError);
        return;
    }

    const user = authData.user;

    // 1. Create order
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_amount: 100,
            status: 'pending',
            shipping_address: '123 Test',
            payment_method: 'COD'
        })
        .select()
        .single();

    if (orderError) {
        console.log("Order Error:", orderError);
        return;
    }
    console.log("Order created:", orderData.id);

    // 2. Create order item
    // Try with fake UUID first
    const orderItems = [{
        order_id: orderData.id,
        product_id: '11111111-1111-1111-1111-111111111111',
        seller_id: user.id,
        quantity: 1,
        price_at_purchase: 100
    }];

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

    if (itemsError) {
        console.log("Items Error:", itemsError);
    } else {
        console.log("Items created successfully");
    }
}
run();
