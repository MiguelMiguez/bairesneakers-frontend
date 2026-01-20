// ===========================================
// COMPONENTS - PRODUCT CARD
// ===========================================

import { useState } from "react";
import { Product, ShoeSize } from "@/types";
import { useCartStore } from "@/store";
import { toast } from "../Toast";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<ShoeSize | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const availableSizes = product.stock
    .filter((s) => s.quantity > 0)
    .map((s) => s.size);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor selecciona una talla");
      return;
    }
    addItem(product, selectedSize);
    toast.success(`${product.name} agregado al carrito`);
    setSelectedSize(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  return (
    <article className={styles.card}>
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

        <div className={styles.sizes}>
          {availableSizes.map((size) => (
            <button
              key={size}
              className={`${styles.sizeButton} ${
                selectedSize === size ? styles.sizeSelected : ""
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={handleAddToCart}
            disabled={availableSizes.length === 0}
          >
            {availableSizes.length === 0 ? "Sin stock" : "Agregar al carrito"}
          </button>
          {onViewDetails && (
            <button
              className={styles.detailsButton}
              onClick={() => onViewDetails(product)}
            >
              Ver más
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
