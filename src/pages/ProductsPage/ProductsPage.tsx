import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Package,
} from "lucide-react";
import { useProducts } from "@/hooks";
import {
  ProductCard,
  ProductCardSkeleton,
  FilterPanel,
  MobileFilters,
} from "@/components";
import { useProductFilters } from "./useProductFilters";
import {
  CATEGORIES,
  GENRES,
  SIZES,
  BRANDS,
  SORT_OPTIONS,
  DEFAULT_PAGINATION,
} from "./constants";
import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Use filter hook
  const {
    searchQuery,
    category,
    genre,
    selectedSizes,
    selectedBrands,
    priceRange,
    sortBy,
    activeFiltersCount,
    setSearchQuery,
    setPriceRange,
    setSortBy,
    toggleSize,
    toggleBrand,
    handleCategoryChange,
    handleGenreChange,
    clearAllFilters,
    buildApiFilters,
    getSortConfig,
  } = useProductFilters();

  // Get sort configuration
  const sortConfig = getSortConfig();

  // Fetch products
  const { products, pagination, isLoading, error, setFilters, setPage } =
    useProducts({
      filters: buildApiFilters(),
      pagination: {
        page: DEFAULT_PAGINATION.page,
        limit: DEFAULT_PAGINATION.limit,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      },
    });

  // Apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(buildApiFilters());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    selectedBrands,
    priceRange,
    category,
    genre,
    buildApiFilters,
    setFilters,
  ]);

  // Filter products by size on client side
  const filteredProducts = useMemo(() => {
    if (selectedSizes.length === 0) return products;

    return products.filter((product) =>
      product.stock.some(
        (s) => selectedSizes.includes(s.size) && s.quantity > 0,
      ),
    );
  }, [products, selectedSizes]);

  // Common filter props
  const filterProps = {
    searchQuery,
    onSearchChange: setSearchQuery,
    category,
    onCategoryChange: handleCategoryChange,
    categoryOptions: CATEGORIES,
    genre,
    onGenreChange: handleGenreChange,
    genreOptions: GENRES,
    brands: BRANDS,
    selectedBrands,
    onBrandToggle: toggleBrand,
    sizes: SIZES,
    selectedSizes,
    onSizeToggle: toggleSize,
    priceRange,
    onPriceChange: setPriceRange,
    activeFiltersCount,
    onClearFilters: clearAllFilters,
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <LayoutGrid size={32} strokeWidth={1.5} />
              <div>
                <h1>Sneakers</h1>
                <p>Explora nuestra colección completa</p>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              className={styles.mobileFilterToggle}
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal size={20} />
              Filtros
              {activeFiltersCount > 0 && (
                <span className={styles.filterBadge}>{activeFiltersCount}</span>
              )}
            </button>
          </div>

          {/* Sort & Results Count */}
          <div className={styles.toolbar}>
            <span className={styles.resultsCount}>
              {isLoading
                ? "Cargando..."
                : `${filteredProducts.length} productos`}
            </span>
            <div className={styles.sortWrapper}>
              <label htmlFor="sort">Ordenar:</label>
              <div className={styles.selectWrapper}>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {/* Desktop Sidebar */}
          <aside className={styles.sidebar}>
            <FilterPanel {...filterProps} />
          </aside>

          {/* Mobile Filters Modal */}
          <MobileFilters
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            resultsCount={filteredProducts.length}
            {...filterProps}
          />

          {/* Products Grid */}
          <main className={styles.main}>
            {isLoading ? (
              <div className={styles.productsGrid}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className={styles.emptyState}>
                <Package size={64} strokeWidth={1} />
                <h3>Error al cargar productos</h3>
                <p>Intenta recargar la página</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <Package size={64} strokeWidth={1} />
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
                {activeFiltersCount > 0 && (
                  <button
                    className={styles.clearFiltersBtn}
                    onClick={clearAllFilters}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className={styles.productsGrid}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={() => navigate(`/sneakers/${product.id}`)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.paginationBtn}
                      disabled={!pagination.hasPrevPage}
                      onClick={() => setPage(pagination.currentPage - 1)}
                    >
                      <ChevronLeft size={20} />
                      Anterior
                    </button>
                    <div className={styles.paginationInfo}>
                      <span className={styles.currentPage}>
                        {pagination.currentPage}
                      </span>
                      <span className={styles.totalPages}>
                        de {pagination.totalPages}
                      </span>
                    </div>
                    <button
                      className={styles.paginationBtn}
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPage(pagination.currentPage + 1)}
                    >
                      Siguiente
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
