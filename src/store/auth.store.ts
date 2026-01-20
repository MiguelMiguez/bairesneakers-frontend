// ===========================================
// STORE - AUTH STORE (ZUSTAND)
// ===========================================

import { create } from 'zustand';
import { User } from '@/types';

interface AuthStoreState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setAdmin: (isAdmin: boolean) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
};

/**
 * Store de autenticación usando Zustand
 * Complementa el hook useAuth para compartir estado globalmente
 */
export const useAuthStore = create<AuthStoreState>()((set) => ({
  ...initialState,
  
  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },
  
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  
  setAdmin: (isAdmin) => {
    set({ isAdmin });
  },
  
  reset: () => {
    set(initialState);
  },
}));
