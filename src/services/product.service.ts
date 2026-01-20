// ===========================================
// SERVICES - PRODUCT SERVICE IMPLEMENTATION
// ===========================================

import { httpClient } from './http.service';
import { IProductService } from './interfaces';
import { 
  Product, 
  ProductFilters, 
  PaginationOptions, 
  PaginatedResponse 
} from '@/types';

/**
 * Implementación del servicio de productos
 * Usa el httpClient para comunicarse con el backend
 */
class ProductService implements IProductService {
  private readonly endpoint = '/products';

  async getProductById(id: string): Promise<Product> {
    return httpClient.get<Product>(`${this.endpoint}/${id}`);
  }

  async getProducts(
    filters?: ProductFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResponse<Product>> {
    const params: Record<string, string> = {};

    // Paginación
    if (pagination) {
      params.page = String(pagination.page);
      params.limit = String(pagination.limit);
      if (pagination.sortBy) params.sortBy = pagination.sortBy;
      if (pagination.sortOrder) params.sortOrder = pagination.sortOrder;
    }

    // Filtros
    if (filters) {
      if (filters.category) params.category = filters.category;
      if (filters.genre) params.genre = filters.genre;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minPrice) params.minPrice = String(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = String(filters.maxPrice);
      if (filters.search) params.search = filters.search;
      if (filters.isFeatured !== undefined) params.featured = String(filters.isFeatured);
    }

    return httpClient.get<PaginatedResponse<Product>>(this.endpoint, params);
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    return httpClient.get<Product[]>(`${this.endpoint}/featured`, {
      limit: String(limit),
    });
  }

  async createProduct(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> {
    return httpClient.post<Product>(this.endpoint, product);
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return httpClient.put<Product>(`${this.endpoint}/${id}`, updates);
  }

  async deleteProduct(id: string): Promise<void> {
    return httpClient.delete(`${this.endpoint}/${id}`);
  }
}

// Singleton instance
export const productService = new ProductService();
