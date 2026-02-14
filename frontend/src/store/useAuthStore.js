import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: 'buyer', // default
  isAuthenticated: false,
  isLoading: true,

  // Initialize auth state listener
  initialize: async () => {
    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await get().fetchProfile(session.user.id);
    } else {
      set({ isLoading: false });
    }

    // Listen for changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // If we don't have the user profile yet, fetch it
        if (!get().user) {
          await get().fetchProfile(session.user.id);
        }
      } else {
        set({ user: null, isAuthenticated: false, role: 'buyer', isLoading: false });
      }
    });
  },

  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        set({
          user: { id: userId, ...data },
          role: data.role || 'buyer',
          isAuthenticated: true,
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback if profile doesn't exist yet but user is logged in
      set({ isAuthenticated: true, isLoading: false });
    }
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signup: async (email, password, fullName, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, role: 'buyer' });
  },
}));
