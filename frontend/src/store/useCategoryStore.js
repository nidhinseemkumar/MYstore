import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useCategoryStore = create((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            
            // Temporary patch since live DB update is blocked by RLS
            const patchedData = data?.map(category => {
                if (category.name === 'Instant Food') {
                    return { ...category, image_url: 'https://cdn-icons-png.flaticon.com/512/3448/3448066.png' };
                }
                if (category.name === 'Tea, Coffee & Health Drinks') {
                    return { ...category, image_url: 'https://cdn-icons-png.flaticon.com/512/924/924514.png' };
                }
                return category;
            });

            set({ categories: patchedData || [], isLoading: false });
        } catch (error) {
            console.error("Error fetching categories:", error);
            set({ error: error.message, isLoading: false });
        }
    },
}));
