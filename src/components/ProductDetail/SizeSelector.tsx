// ===========================================
// PRODUCT DETAIL - SIZE SELECTOR COMPONENT
// ===========================================

import type { ShoeSize } from "@/types";
import styles from "./ProductDetail.module.css";

interface SizeStock {
  size: ShoeSize;
  quantity: number;
}

interface SizeSelectorProps {
  stock: SizeStock[];
  selectedSize: ShoeSize | null;
  onSelectSize: (size: ShoeSize) => void;
  cartQuantity?: number;
}

export function SizeSelector({
  stock,
  selectedSize,
  onSelectSize,
  cartQuantity = 0,
}: SizeSelectorProps) {
  const selectedSizeStock =
    stock.find((s) => s.size === selectedSize)?.quantity || 0;

  return (
    <div className={styles.sizeSection}>
      <div className={styles.sizeHeader}>
        <h3>Talle</h3>
        <button className={styles.sizeGuide}>Guía de talles</button>
      </div>

      <div className={styles.sizes}>
        {stock.map((sizeStock) => (
          <button
            key={sizeStock.size}
            className={`
              ${styles.sizeButton} 
              ${selectedSize === sizeStock.size ? styles.selected : ""} 
              ${sizeStock.quantity === 0 ? styles.outOfStock : ""}
            `}
            onClick={() => {
              if (sizeStock.quantity > 0) {
                onSelectSize(sizeStock.size);
              }
            }}
            disabled={sizeStock.quantity === 0}
            title={
              sizeStock.quantity === 0
                ? "Sin stock"
                : `${sizeStock.quantity} disponibles`
            }
          >
            {sizeStock.size}
            {sizeStock.quantity > 0 && sizeStock.quantity <= 3 && (
              <span className={styles.lowStockIndicator}>!</span>
            )}
          </button>
        ))}
      </div>

      {!selectedSize && (
        <p className={styles.sizeWarning}>Selecciona un talle para continuar</p>
      )}

      {selectedSize && (
        <p className={styles.stockInfo}>
          {selectedSizeStock <= 3
            ? `¡Solo quedan ${selectedSizeStock} unidades!`
            : `${selectedSizeStock} disponibles`}
          {cartQuantity > 0 && ` (${cartQuantity} en carrito)`}
        </p>
      )}
    </div>
  );
}
