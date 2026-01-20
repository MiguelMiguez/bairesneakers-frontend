// ===========================================
// SERVICES - AUTH SERVICE IMPLEMENTATION
// ===========================================

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { firebaseAuth } from '@/config';
import { httpClient } from './http.service';
import { IAuthService, LoginCredentials, RegisterData } from './interfaces';
import { User } from '@/types';

/**
 * Implementación del servicio de autenticación
 * Integra Firebase Auth con el backend
 */
class AuthService implements IAuthService {
  private readonly endpoint = '/users';

  async login(credentials: LoginCredentials): Promise<User> {
    // 1. Autenticar con Firebase
    await signInWithEmailAndPassword(
      firebaseAuth, 
      credentials.email, 
      credentials.password
    );

    // 2. Sincronizar con backend
    return this.syncUser();
  }

  async register(data: RegisterData): Promise<User> {
    // 1. Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      data.email,
      data.password
    );

    // 2. Actualizar perfil en Firebase
    await updateProfile(userCredential.user, {
      displayName: data.displayName,
    });

    // 3. Crear usuario en backend
    return httpClient.post<User>(this.endpoint, {
      displayName: data.displayName,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = firebaseAuth.currentUser;
    
    if (!firebaseUser) {
      return null;
    }

    try {
      return await httpClient.get<User>(`${this.endpoint}/me`);
    } catch {
      return null;
    }
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(firebaseAuth, email);
  }

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    
    // 1. Login con Google
    await signInWithPopup(firebaseAuth, provider);

    // 2. Sincronizar con backend
    return this.syncUser();
  }

  async syncUser(): Promise<User> {
    return httpClient.post<User>(`${this.endpoint}/sync`);
  }

  /**
   * Obtiene el token de ID actual del usuario
   * Útil para verificar claims personalizados
   */
  async getIdTokenResult() {
    const user = firebaseAuth.currentUser;
    if (!user) return null;
    
    return user.getIdTokenResult(true);
  }

  /**
   * Verifica si el usuario actual es admin
   */
  async isAdmin(): Promise<boolean> {
    const tokenResult = await this.getIdTokenResult();
    return tokenResult?.claims['role'] === 'admin';
  }
}

// Singleton instance
export const authService = new AuthService();
