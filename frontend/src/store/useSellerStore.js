import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useSellerStore = create((set, get) => ({
    stats: {
        totalSales: 0,
        totalOrders: 0,
        productsCount: 0,
        recentOrders: []
    },
    isLoading: false,
    error: null,

    fetchDashboardStats: async (sellerId) => {
        set({ isLoading: true, error: null });
        try {
            if (!sellerId) throw new Error("Seller ID required");

            // 1. Get Total Sales & Orders (from order_items table where seller_id matches)
            // We sum price_at_purchase * quantity
            const { data: salesData, error: salesError } = await supabase
                .from('order_items')
                .select('price_at_purchase, quantity, created_at, order_id')
                .eq('seller_id', sellerId);

            if (salesError) throw salesError;

            const totalSales = salesData.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);

            // Calculate unique orders count
            const uniqueOrderIds = new Set(salesData.map(item => item.order_id));
            const totalOrders = uniqueOrderIds.size;

            // 2. Get Products Count
            const { count: productsCount, error: productsError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('seller_id', sellerId);

            if (productsError) throw productsError;

            // 3. Get Recent Orders (Detailed)
            // We want distinct orders, but Supabase JS doesn't support distinct on select easily with relations
            // So we fetch order items and group them manually or fetch orders where ID is in our list
            const { data: recentItems, error: recentError } = await supabase
                .from('order_items')
                .select(`
                    id, 
                    created_at, 
                    price_at_purchase, 
                    quantity,
                    product:products(name, image_url),
                    order:orders(id, status, user:user_id(email)) 
                `)
                .eq('seller_id', sellerId)
                .order('created_at', { ascending: false })
                .limit(10);

            if (recentError) throw recentError;


            set({
                stats: {
                    totalSales,
                    totalOrders,
                    productsCount: productsCount || 0,
                    recentOrders: recentItems
                },
                isLoading: false
            });

        } catch (error) {
            console.error('Error fetching seller starts:', error);
            set({ error: error.message, isLoading: false });
        }
    }
}));
