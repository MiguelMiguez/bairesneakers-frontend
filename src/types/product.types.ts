// ===========================================
// TYPES - PRODUCT INTERFACES
// ===========================================

export type ProductCategory = 'sneakers' | 'boots' | 'sandals' | 'casual';
export type ProductGenre = 'masculino' | 'femenino' | 'unisex' | 'niño' | 'niña';
export type ShoeSize = 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46;

export interface SizeStock {
  size: ShoeSize;
  quantity: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  model: string;
  brand: string;
  description: string;
  category: ProductCategory;
  genre: ProductGenre;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  thumbnail: string;
  stock: SizeStock[];
  totalStock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  category?: ProductCategory;
  genre?: ProductGenre;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
