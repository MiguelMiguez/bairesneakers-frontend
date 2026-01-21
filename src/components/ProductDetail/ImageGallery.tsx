// ===========================================
// PRODUCT DETAIL - IMAGE GALLERY COMPONENT
// ===========================================

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import styles from "./ProductDetail.module.css";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  isFeatured?: boolean;
}

export function ImageGallery({
  images,
  productName,
  isFeatured,
}: ImageGalleryProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset index when images change
  useEffect(() => {
    setMainImageIndex(0);
  }, [images]);

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === "Escape") setIsZoomed(false);
        if (e.key === "ArrowLeft") handleImageNavigation("prev");
        if (e.key === "ArrowRight") handleImageNavigation("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed, images]);

  return (
    <>
      <div className={styles.gallery}>
        <div className={styles.mainImageWrapper}>
          {images.length > 1 && (
            <>
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={() => handleImageNavigation("prev")}
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={() => handleImageNavigation("next")}
                aria-label="Imagen siguiente"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <button
            className={styles.zoomButton}
            onClick={() => setIsZoomed(true)}
            aria-label="Ver imagen en grande"
          >
            <ZoomIn size={20} />
          </button>

          <div className={styles.mainImage}>
            <img
              src={images[mainImageIndex]}
              alt={`${productName} - Imagen ${mainImageIndex + 1}`}
            />
          </div>

          {isFeatured && (
            <span className={styles.featuredBadge}>Destacado</span>
          )}
        </div>

        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((img, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${mainImageIndex === index ? styles.active : ""}`}
                onClick={() => setMainImageIndex(index)}
              >
                <img src={img} alt={`${productName} vista ${index + 1}`} />
              </button>
            ))}
          </div>
        )}

        <div className={styles.imageCounter}>
          {mainImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className={styles.zoomModal} onClick={() => setIsZoomed(false)}>
          <button
            className={styles.zoomClose}
            onClick={() => setIsZoomed(false)}
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                className={`${styles.zoomNav} ${styles.zoomPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageNavigation("prev");
                }}
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className={`${styles.zoomNav} ${styles.zoomNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageNavigation("next");
                }}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <img
            src={images[mainImageIndex]}
            alt={productName}
            onClick={(e) => e.stopPropagation()}
          />

          <div className={styles.zoomCounter}>
            {mainImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
