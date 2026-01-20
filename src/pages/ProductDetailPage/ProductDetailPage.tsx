// ===========================================
// PAGES - PRODUCT DETAIL PAGE
// ===========================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks';
import { useCartStore } from '@/store';
import styles from './ProductDetailPage.module.css';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(id || '');
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      imageUrl: product.images[0],
    });
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>Producto no encontrado</p>
            <button onClick={() => navigate('/sneakers')}>
              Volver a productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className={styles.content}>
          {/* Images */}
          <div className={styles.images}>
            <div className={styles.mainImage}>
              <img
                src={product.images[mainImage]}
                alt={product.name}
              />
            </div>
            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${mainImage === index ? styles.active : ''}`}
                    onClick={() => setMainImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className={styles.details}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>${product.price.toLocaleString('es-AR')}</p>
            
            <p className={styles.description}>{product.description}</p>

            {/* Size Selection */}
            <div className={styles.sizeSection}>
              <h3>Talle</h3>
              <div className={styles.sizes}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <span className={styles.sizeWarning}>Selecciona un talle</span>
              )}
            </div>

            {/* Quantity */}
            <div className={styles.quantitySection}>
              <h3>Cantidad</h3>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className={styles.stock}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
              </span>
            </div>

            {/* Add to Cart */}
            <button
              className={styles.addToCart}
              onClick={handleAddToCart}
              disabled={!selectedSize || product.stock === 0}
            >
              {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>

            {/* Extra Info */}
            <div className={styles.extraInfo}>
              <div className={styles.infoItem}>
                <span>🚚</span> Envío gratis en compras +$50.000
              </div>
              <div className={styles.infoItem}>
                <span>↩️</span> 30 días para devoluciones
              </div>
              <div className={styles.infoItem}>
                <span>✓</span> Producto 100% original
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
