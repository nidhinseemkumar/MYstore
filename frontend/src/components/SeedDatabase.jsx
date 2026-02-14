import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { POPULAR_PRODUCTS } from '../data/mockData';

export const SeedDatabase = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const seedProducts = async () => {
        setLoading(true);
        setStatus('Starting seed...');

        try {
            // Get current user to set as seller
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setStatus('Error: You must be logged in to seed data.');
                setLoading(false);
                return;
            }

            // Check if user is seller or admin
            // In a real app we'd check profile role, but for seeding we just need a valid UUID

            const productsToInsert = POPULAR_PRODUCTS.map(p => ({
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
                image_url: p.image, // Note: Schema uses image_url, mock uses image
                seller_id: user.id, // Assigning current user as seller
                stock_quantity: 100 // Default stock
            }));

            const { data, error } = await supabase
                .from('products')
                .insert(productsToInsert)
                .select();

            if (error) throw error;

            setStatus(`Success! Added ${data.length} products to database.`);
        } catch (error) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50 my-4">
            <h3 className="font-bold mb-2">Database Seeder (Dev Only)</h3>
            <p className="text-sm text-gray-600 mb-4">
                Click below to upload all mock products to your Supabase database.
                You must be logged in first.
            </p>
            <button
                onClick={seedProducts}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? 'Seeding...' : 'Seed Products Table'}
            </button>
            {status && <p className="mt-2 text-sm font-mono">{status}</p>}
        </div>
    );
};
