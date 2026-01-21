// ===========================================
// PRODUCT DETAIL - QUANTITY SELECTOR
// ===========================================

import { Minus, Plus } from "lucide-react";
import styles from "./ProductDetail.module.css";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (delta: number) => void;
}

export function QuantitySelector({
  quantity,
  maxQuantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  return (
    <div className={styles.quantitySection}>
      <h3>Cantidad</h3>
      <div className={styles.quantityControls}>
        <button
          onClick={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
          aria-label="Reducir cantidad"
        >
          <Minus size={18} />
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => onQuantityChange(1)}
          disabled={quantity >= maxQuantity}
          aria-label="Aumentar cantidad"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
