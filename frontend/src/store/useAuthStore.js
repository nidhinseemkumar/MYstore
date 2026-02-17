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
      await get().fetchProfile(session.user.id, session.user);
    } else {
      set({ isLoading: false });
    }

    // Listen for changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // If we don't have the user profile yet, fetch it
        if (!get().user) {
          await get().fetchProfile(session.user.id, session.user);
        }
      } else {
        set({ user: null, isAuthenticated: false, role: 'buyer', isLoading: false });
      }
    });
  },

  fetchProfile: async (userId, sessionUser = null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Determine role hierarchy:
      // 1. Hardcoded Admin Email (Rescue)
      // 2. Database Profile Role
      // 3. Auth Metadata Role
      // 4. Default 'buyer'
      let finalRole = 'buyer';

      if (sessionUser?.email === 'admin@mystore.com') {
        finalRole = 'admin';
      } else if (data?.role) {
        finalRole = data.role;
      } else if (sessionUser?.user_metadata?.role) {
        finalRole = sessionUser.user_metadata.role;
      }

      const userObject = {
        id: userId,
        ...(data || {}),
        email: sessionUser?.email || data?.email,
        role: finalRole
      };

      set({
        user: userObject,
        role: finalRole,
        isAuthenticated: true,
        isLoading: false
      });

    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback
      let finalRole = sessionUser?.user_metadata?.role || 'buyer';
      if (sessionUser?.email === 'admin@mystore.com') {
        finalRole = 'admin';
      }

      set({
        user: sessionUser ? { ...sessionUser, role: finalRole } : { id: userId, role: finalRole },
        role: finalRole,
        isAuthenticated: true,
        isLoading: false
      });
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
