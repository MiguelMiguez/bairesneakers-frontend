// ===========================================
// SERVICES - HTTP CLIENT
// ===========================================

import { config } from '@/config';
import { ApiResponse, ApiErrorResponse } from '@/types';
import { firebaseAuth } from '@/config';

/**
 * Cliente HTTP base para comunicación con el backend
 * Implementa el patrón Adapter para abstraer fetch
 */
class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Obtiene el token de autenticación actual
   */
  private async getAuthToken(): Promise<string | null> {
    const user = firebaseAuth.currentUser;
    if (!user) return null;
    
    try {
      return await user.getIdToken();
    } catch {
      return null;
    }
  }

  /**
   * Construye los headers para la petición
   */
  private async buildHeaders(customHeaders?: HeadersInit): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...customHeaders,
    });

    const token = await this.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Maneja la respuesta de la API
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      throw new Error(errorData.error?.message || 'Request failed');
    }

    const successData = data as ApiResponse<T>;
    return successData.data;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }

    const headers = await this.buildHeaders();
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const headers = await this.buildHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const headers = await this.buildHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const headers = await this.buildHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T = void>(endpoint: string): Promise<T> {
    const headers = await this.buildHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    return this.handleResponse<T>(response);
  }
}

// Exportar instancia singleton
export const httpClient = new HttpClient(config.apiUrl);
