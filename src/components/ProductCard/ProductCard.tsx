// ===========================================
// COMPONENTS - PRODUCT CARD (Refactored)
// ===========================================

import { Product } from "@/types";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const availableSizes = product.stock
    .filter((s) => s.quantity > 0)
    .map((s) => s.size);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={product.thumbnail}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {product.isFeatured && <span className={styles.badge}>Destacado</span>}
        {product.compareAtPrice && (
          <span className={styles.discount}>
            -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
          </span>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.brand}>{product.brand}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.model}>{product.model}</p>

        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className={styles.comparePrice}>
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Size badges - visual only, no interaction */}
        <div className={styles.sizes}>
          {availableSizes.length > 0 ? (
            <>
              {availableSizes.slice(0, 5).map((size) => (
                <span key={size} className={styles.sizeBadge}>
                  {size}
                </span>
              ))}
              {availableSizes.length > 5 && (
                <span className={styles.moreSizes}>
                  +{availableSizes.length - 5}
                </span>
              )}
            </>
          ) : (
            <span className={styles.noStock}>Sin stock</span>
          )}
        </div>

        {/* Single CTA button */}
        <button
          className={styles.viewButton}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={availableSizes.length === 0}
        >
          {availableSizes.length === 0 ? "Sin stock" : "Ver producto"}
        </button>
      </div>
    </article>
  );
}
