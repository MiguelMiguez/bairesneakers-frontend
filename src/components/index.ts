// ===========================================
// COMPONENTS - BARREL EXPORT
// ===========================================

export { ProductCard } from "./ProductCard";
export { ProductCardSkeleton } from "./ProductCardSkeleton";
export { Cart } from "./Cart";
export { Navbar } from "./Navbar";
export { Footer } from "./Footer";
export { ProtectedRoute } from "./ProtectedRoute";
export { AdminRoute } from "./AdminRoute";
export { ToastProvider, toast } from "./Toast";
export { Modal, ConfirmDialog } from "./Modal";
export { Dialog, DialogActions, DialogConfirm, DialogAlert } from "./Dialog";

// Reusable Components
export { Form, FormField, FormSection, commonFields } from "./Form";
export type { FormConfig, FieldConfig, FormSectionConfig } from "./Form";
export { StatsCard, StatsGrid } from "./StatsCard";
export type { StatCardData } from "./StatsCard";
export { DataTable } from "./DataTable";
export type { Column } from "./DataTable";
export { Marquee } from "./Marquee";
export { InfoCard } from "./InfoCard";
export { Breadcrumb } from "./Breadcrumb";
export type { BreadcrumbItem } from "./Breadcrumb";

// Filters
export {
  SearchFilter,
  ChipFilter,
  SizeFilter,
  PriceFilter,
  FilterPanel,
  MobileFilters,
} from "./Filters";
export type {
  FilterOption,
  PriceRange,
  FilterPanelProps,
  MobileFiltersProps,
} from "./Filters";

// Product Detail Components
export {
  ImageGallery,
  SizeSelector,
  QuantitySelector,
  ProductFeatures,
  ProductTags,
  ProductRating,
} from "./ProductDetail";
