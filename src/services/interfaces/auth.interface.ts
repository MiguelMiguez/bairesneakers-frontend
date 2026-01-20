// ===========================================
// SERVICES - AUTH SERVICE INTERFACE
// ===========================================

import { User } from '@/types';

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos de registro
 */
export interface RegisterData extends LoginCredentials {
  displayName: string;
  firstName: string;
  lastName: string;
}

/**
 * Interface que define el contrato del servicio de autenticación
 */
export interface IAuthService {
  /**
   * Inicia sesión con email y password
   */
  login(credentials: LoginCredentials): Promise<User>;

  /**
   * Registra un nuevo usuario
   */
  register(data: RegisterData): Promise<User>;

  /**
   * Cierra sesión
   */
  logout(): Promise<void>;

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Envía email de recuperación de contraseña
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Login con Google
   */
  loginWithGoogle(): Promise<User>;

  /**
   * Sincroniza el usuario con el backend
   */
  syncUser(): Promise<User>;
}
