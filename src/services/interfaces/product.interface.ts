// ===========================================
// SERVICES - PRODUCT SERVICE INTERFACE
// ===========================================

import { 
  Product, 
  ProductFilters, 
  PaginationOptions, 
  PaginatedResponse 
} from '@/types';

/**
 * Interface que define el contrato del servicio de productos
 * Permite cambiar la implementación sin afectar los consumidores
 */
export interface IProductService {
  /**
   * Obtiene un producto por su ID
   */
  getProductById(id: string): Promise<Product>;

  /**
   * Obtiene productos con filtros y paginación
   */
  getProducts(
    filters?: ProductFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResponse<Product>>;

  /**
   * Obtiene productos destacados
   */
  getFeaturedProducts(limit?: number): Promise<Product[]>;

  /**
   * Crea un producto (Admin only)
   */
  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;

  /**
   * Actualiza un producto (Admin only)
   */
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;

  /**
   * Elimina un producto (Admin only)
   */
  deleteProduct(id: string): Promise<void>;
}
