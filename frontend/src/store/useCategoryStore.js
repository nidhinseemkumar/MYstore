import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CATEGORIES as mockCategories } from '../data/mockData';

export const useCategoryStore = create((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    // Fallback to mock data if it fails, useful for development
    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;

            // If empty, it might mean the table hasn't been created yet or is empty. Let's still use it if it succeeds.
            set({ categories: data, isLoading: false });
        } catch (error) {
            console.error("Error fetching categories, falling back to mock:", error);
            // Fallback gracefully
            set({ categories: mockCategories, error: error.message, isLoading: false });
        }
    },
}));
