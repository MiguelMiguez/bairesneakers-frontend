// ===========================================
// COMPONENTS - PRODUCT CARD SKELETON
// ===========================================

import styles from "./ProductCardSkeleton.module.css";

export function ProductCardSkeleton() {
  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.imageSkeleton} />
      </div>
      <div className={styles.content}>
        <div className={styles.brandSkeleton} />
        <div className={styles.nameSkeleton} />
        <div className={styles.modelSkeleton} />
        <div className={styles.priceSkeleton} />
        <div className={styles.sizesSkeleton}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.sizeSkeleton} />
          ))}
        </div>
        <div className={styles.actionsSkeleton}>
          <div className={styles.buttonSkeleton} />
          <div className={styles.buttonSmallSkeleton} />
        </div>
      </div>
    </article>
  );
}
