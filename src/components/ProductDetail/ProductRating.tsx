// ===========================================
// PRODUCT DETAIL - PRODUCT RATING
// ===========================================

import { Star } from "lucide-react";
import styles from "./ProductDetail.module.css";

interface ProductRatingProps {
  rating?: number;
  reviewCount?: number;
}

export function ProductRating({
  rating = 4,
  reviewCount = 24,
}: ProductRatingProps) {
  return (
    <div className={styles.rating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? "#fbbf24" : "none"}
          color="#fbbf24"
        />
      ))}
      <span>({reviewCount} reseñas)</span>
    </div>
  );
}
