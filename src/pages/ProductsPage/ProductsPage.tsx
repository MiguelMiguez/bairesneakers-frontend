// ===========================================
// PAGES - PRODUCTS PAGE
// ===========================================

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Package,
} from "lucide-react";
import { useProducts } from "@/hooks";
import { ProductCard, ProductCardSkeleton } from "@/components";
import {
  ProductFilters,
  ProductCategory,
  ProductGenre,
  ShoeSize,
} from "@/types";
import styles from "./ProductsPage.module.css";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "sneakers", label: "Sneakers" },
  { value: "boots", label: "Boots" },
  { value: "sandals", label: "Sandalias" },
  { value: "casual", label: "Casual" },
];

const GENRES: { value: ProductGenre; label: string }[] = [
  { value: "masculino", label: "Hombre" },
  { value: "femenino", label: "Mujer" },
  { value: "unisex", label: "Unisex" },
  { value: "niño", label: "Niño" },
  { value: "niña", label: "Niña" },
];

const SIZES: ShoeSize[] = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

const BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Converse",
  "Reebok",
  "Vans",
];

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Más recientes" },
  { value: "createdAt-asc", label: "Más antiguos" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "name-asc", label: "A - Z" },
  { value: "name-desc", label: "Z - A" },
];

export function ProductsPage() {
  const navigate = useNavigate();
  const [filters, setFiltersState] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<ShoeSize[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const { products, pagination, isLoading, error, setFilters, setPage } =
    useProducts({
      filters,
      pagination: {
        page: 1,
        limit: 12,
        sortBy: sortBy.split("-")[0],
        sortOrder: sortBy.split("-")[1] as "asc" | "desc",
      },
    });

  // Aplicar filtros con debounce para búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilters: ProductFilters = {};

      if (filters.category) newFilters.category = filters.category;
      if (filters.genre) newFilters.genre = filters.genre;

      if (searchQuery) {
        newFilters.search = searchQuery;
      }

      if (selectedBrands.length === 1) {
        newFilters.brand = selectedBrands[0];
      }

      if (priceRange.min) {
        newFilters.minPrice = Number(priceRange.min);
      }

      if (priceRange.max) {
        newFilters.maxPrice = Number(priceRange.max);
      }

      setFilters(newFilters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    selectedBrands,
    priceRange,
    filters.category,
    filters.genre,
  ]);

  // Filtrar productos por talla en el cliente
  const filteredProducts = useMemo(() => {
    if (selectedSizes.length === 0) return products;

    return products.filter((product) =>
      product.stock.some(
        (s) => selectedSizes.includes(s.size) && s.quantity > 0,
      ),
    );
  }, [products, selectedSizes]);

  const handleCategoryChange = (category: ProductCategory | "") => {
    const newFilters = { ...filters };
    if (category) {
      newFilters.category = category;
    } else {
      delete newFilters.category;
    }
    setFiltersState(newFilters);
  };

  const handleGenreChange = (genre: ProductGenre | "") => {
    const newFilters = { ...filters };
    if (genre) {
      newFilters.genre = genre;
    } else {
      delete newFilters.genre;
    }
    setFiltersState(newFilters);
  };

  const toggleSize = (size: ShoeSize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearAllFilters = () => {
    setFiltersState({});
    setFilters({});
    setSearchQuery("");
    setSelectedSizes([]);
    setSelectedBrands([]);
    setPriceRange({ min: "", max: "" });
    setSortBy("createdAt-desc");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.genre) count++;
    if (selectedSizes.length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (priceRange.min || priceRange.max) count++;
    if (searchQuery) count++;
    return count;
  }, [filters, selectedSizes, selectedBrands, priceRange, searchQuery]);

  const FilterContent = () => (
    <>
      {/* Search */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Buscar</label>
        <div className={styles.searchInputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Categoría</label>
        <div className={styles.chipGroup}>
          <button
            className={`${styles.chip} ${!filters.category ? styles.chipActive : ""}`}
            onClick={() => handleCategoryChange("")}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.chip} ${filters.category === cat.value ? styles.chipActive : ""}`}
              onClick={() => handleCategoryChange(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Género</label>
        <div className={styles.chipGroup}>
          <button
            className={`${styles.chip} ${!filters.genre ? styles.chipActive : ""}`}
            onClick={() => handleGenreChange("")}
          >
            Todos
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre.value}
              className={`${styles.chip} ${filters.genre === genre.value ? styles.chipActive : ""}`}
              onClick={() => handleGenreChange(genre.value)}
            >
              {genre.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Marca</label>
        <div className={styles.chipGroup}>
          {BRANDS.map((brand) => (
            <button
              key={brand}
              className={`${styles.chip} ${selectedBrands.includes(brand) ? styles.chipActive : ""}`}
              onClick={() => toggleBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Talle</label>
        <div className={styles.sizeGrid}>
          {SIZES.map((size) => (
            <button
              key={size}
              className={`${styles.sizeChip} ${selectedSizes.includes(size) ? styles.sizeChipActive : ""}`}
              onClick={() => toggleSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Precio</label>
        <div className={styles.priceInputs}>
          <div className={styles.priceInputWrapper}>
            <span className={styles.currencySymbol}>$</span>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange((prev) => ({ ...prev, min: e.target.value }))
              }
              className={styles.priceInput}
            />
          </div>
          <span className={styles.priceSeparator}>—</span>
          <div className={styles.priceInputWrapper}>
            <span className={styles.currencySymbol}>$</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange((prev) => ({ ...prev, max: e.target.value }))
              }
              className={styles.priceInput}
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <button className={styles.clearButton} onClick={clearAllFilters}>
          <X size={16} />
          Limpiar filtros ({activeFiltersCount})
        </button>
      )}
    </>
  );

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
            <div className={styles.sidebarHeader}>
              <SlidersHorizontal size={20} />
              <span>Filtros</span>
            </div>
            <FilterContent />
          </aside>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <div
              className={styles.mobileFiltersOverlay}
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className={styles.mobileFilters}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.mobileFiltersHeader}>
                  <h3>Filtros</h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className={styles.mobileFiltersContent}>
                  <FilterContent />
                </div>
                <div className={styles.mobileFiltersFooter}>
                  <button
                    className={styles.applyFiltersBtn}
                    onClick={() => setShowMobileFilters(false)}
                  >
                    Ver {filteredProducts.length} productos
                  </button>
                </div>
              </div>
            </div>
          )}

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
