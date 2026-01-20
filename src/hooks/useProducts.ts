// ===========================================
// HOOKS - USE PRODUCTS
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services';
import { 
  Product, 
  ProductFilters, 
  PaginationOptions, 
  PaginatedResponse 
} from '@/types';

interface UseProductsOptions {
  filters?: ProductFilters;
  pagination?: PaginationOptions;
  autoFetch?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  pagination: PaginatedResponse<Product>['pagination'] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  setPage: (page: number) => void;
}

/**
 * Custom Hook para obtener productos con filtros y paginación
 * Abstrae la lógica de fetching de la UI
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const {
    filters: initialFilters = {},
    pagination: initialPagination = { page: 1, limit: 12 },
    autoFetch = true,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Product>['pagination'] | null>(null);
  const [filters, setFiltersState] = useState<ProductFilters>(initialFilters);
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productService.getProducts(filters, paginationOptions);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setIsLoading(false);
    }
  }, [filters, paginationOptions]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  const setFilters = useCallback((newFilters: ProductFilters) => {
    setFiltersState(newFilters);
    // Reset to page 1 when filters change
    setPaginationOptions(prev => ({ ...prev, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setPaginationOptions(prev => ({ ...prev, page }));
  }, []);

  return {
    products,
    pagination,
    isLoading,
    error,
    refetch: fetchProducts,
    setFilters,
    setPage,
  };
}

/**
 * Custom Hook para obtener un producto por ID
 */
export function useProduct(productId: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

/**
 * Custom Hook para productos destacados
 */
export function useFeaturedProducts(limit = 6) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeatured = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await productService.getFeaturedProducts(limit);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch featured products'));
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchFeatured,
  };
}
