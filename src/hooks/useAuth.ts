// ===========================================
// HOOKS - USE AUTH
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '@/config';
import { authService, LoginCredentials, RegisterData } from '@/services';
import { User, AuthState } from '@/types';

/**
 * Custom Hook para manejar autenticación
 * Centraliza toda la lógica de auth
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isAdmin: false,
  });

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Obtener datos del usuario del backend
          const user = await authService.getCurrentUser();
          const isAdmin = await authService.isAdmin();

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            isAdmin,
          });
        } catch {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isAdmin: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isAdmin: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const user = await authService.login(credentials);
      const isAdmin = await authService.isAdmin();
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isAdmin,
      });
      
      return user;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<User> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const user = await authService.register(data);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isAdmin: false,
      });
      
      return user;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<User> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const user = await authService.loginWithGoogle();
      const isAdmin = await authService.isAdmin();
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isAdmin,
      });
      
      return user;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
    });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await authService.resetPassword(email);
  }, []);

  return {
    ...authState,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
  };
}
