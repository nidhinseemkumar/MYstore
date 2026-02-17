import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useProductStore = create((set, get) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            set({ products: data, isLoading: false });
        } catch (error) {
            console.error('Error fetching products:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    selectedProduct: null,

    fetchProduct: async (id) => {
        set({ isLoading: true, error: null });
        try {
            // First check if we have it in memory
            const existingProduct = get().products.find(p => p.id === id);
            if (existingProduct) {
                set({ selectedProduct: existingProduct, isLoading: false });
                return;
            }

            // Otherwise fetch from Supabase
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            set({ selectedProduct: data, isLoading: false });
        } catch (error) {
            console.error('Error fetching product:', error);
            set({ error: error.message, isLoading: false });
        }
    },
}));
