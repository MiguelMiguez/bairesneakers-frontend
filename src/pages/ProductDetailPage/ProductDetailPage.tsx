// ===========================================
// PAGES - PRODUCT DETAIL PAGE
// ===========================================

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ZoomIn,
  X,
} from "lucide-react";
import { useProduct } from "@/hooks";
import { useCartStore } from "@/store";
import { ShoeSize } from "@/types";
import { toast, DialogConfirm } from "@/components";
import styles from "./ProductDetailPage.module.css";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(id || "");
  const { addItem, isInCart, getItemQuantity } = useCartStore();

  const [selectedSize, setSelectedSize] = useState<ShoeSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Reset states when product changes
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
    setMainImageIndex(0);
    setAddedToCart(false);
  }, [id]);

  // Calculate selected size stock
  const selectedSizeStock = useMemo(() => {
    if (!product || !selectedSize) return 0;
    return product.stock.find((s) => s.size === selectedSize)?.quantity || 0;
  }, [product, selectedSize]);

  // Check if already in cart
  const itemInCart =
    selectedSize && product ? isInCart(product.id, selectedSize) : false;

  const cartQuantity =
    selectedSize && product ? getItemQuantity(product.id, selectedSize) : 0;

  // Available stock considering cart
  const availableStock = selectedSizeStock - cartQuantity;

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      toast.error("Selecciona un talle antes de agregar al carrito");
      return;
    }

    if (availableStock < quantity) {
      toast.error("No hay suficiente stock disponible");
      return;
    }

    addItem(product, selectedSize, quantity);
    setAddedToCart(true);
    toast.success(`${product.name} agregado al carrito`);

    // Reset after animation
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (!product) return;

    if (direction === "prev") {
      setMainImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    } else {
      setMainImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Mirá estas ${product.name} en SneakerSolid`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado al portapapeles");
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos",
    );
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
  }, [isZoomed, product]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonDetails}>
              <div className={styles.skeletonLine} style={{ width: "30%" }} />
              <div
                className={styles.skeletonLine}
                style={{ width: "80%", height: "2rem" }}
              />
              <div
                className={styles.skeletonLine}
                style={{ width: "40%", height: "1.5rem" }}
              />
              <div className={styles.skeletonLine} style={{ width: "100%" }} />
              <div className={styles.skeletonLine} style={{ width: "90%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no existe o fue eliminado.</p>
            <button onClick={() => navigate("/sneakers")}>
              Ver todos los productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/sneakers">Sneakers</Link>
          <span>/</span>
          <span>{product.brand}</span>
        </nav>

        <div className={styles.content}>
          {/* Gallery Section */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              {product.images.length > 1 && (
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
                  src={product.images[mainImageIndex]}
                  alt={`${product.name} - Imagen ${mainImageIndex + 1}`}
                />
              </div>

              {product.isFeatured && (
                <span className={styles.featuredBadge}>Destacado</span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${mainImageIndex === index ? styles.active : ""}`}
                    onClick={() => setMainImageIndex(index)}
                  >
                    <img src={img} alt={`${product.name} vista ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className={styles.imageCounter}>
              {mainImageIndex + 1} / {product.images.length}
            </div>
          </div>

          {/* Product Info Section */}
          <div className={styles.details}>
            <div className={styles.detailsHeader}>
              <div>
                <span className={styles.brand}>{product.brand}</span>
                <h1 className={styles.name}>{product.name}</h1>
                <p className={styles.model}>{product.model}</p>
              </div>

              <div className={styles.actions}>
                <button
                  className={`${styles.actionButton} ${isFavorite ? styles.active : ""}`}
                  onClick={handleFavorite}
                  aria-label={
                    isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
                  }
                >
                  <Heart
                    size={20}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={handleShare}
                  aria-label="Compartir"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className={styles.priceSection}>
              <span className={styles.price}>
                ${product.price.toLocaleString("es-AR")}
              </span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <>
                    <span className={styles.comparePrice}>
                      ${product.compareAtPrice.toLocaleString("es-AR")}
                    </span>
                    <span className={styles.discount}>
                      -
                      {Math.round(
                        (1 - product.price / product.compareAtPrice) * 100,
                      )}
                      %
                    </span>
                  </>
                )}
            </div>

            {/* Rating placeholder */}
            <div className={styles.rating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= 4 ? "#fbbf24" : "none"}
                  color="#fbbf24"
                />
              ))}
              <span>(24 reseñas)</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Size Selection */}
            <div className={styles.sizeSection}>
              <div className={styles.sizeHeader}>
                <h3>Talle</h3>
                <button className={styles.sizeGuide}>Guía de talles</button>
              </div>

              <div className={styles.sizes}>
                {product.stock.map((sizeStock) => (
                  <button
                    key={sizeStock.size}
                    className={`
                      ${styles.sizeButton} 
                      ${selectedSize === sizeStock.size ? styles.selected : ""} 
                      ${sizeStock.quantity === 0 ? styles.outOfStock : ""}
                    `}
                    onClick={() => {
                      if (sizeStock.quantity > 0) {
                        setSelectedSize(sizeStock.size);
                        setQuantity(1);
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
                <p className={styles.sizeWarning}>
                  Selecciona un talle para continuar
                </p>
              )}

              {selectedSize && (
                <p className={styles.stockInfo}>
                  {selectedSizeStock <= 3
                    ? `¡Solo quedan ${selectedSizeStock} unidades!`
                    : `${selectedSizeStock} disponibles`}
                  {itemInCart && ` (${cartQuantity} en carrito)`}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className={styles.quantitySection}>
              <h3>Cantidad</h3>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Reducir cantidad"
                >
                  <Minus size={18} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={!selectedSize || quantity >= availableStock}
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className={styles.cartActions}>
              <button
                className={`${styles.addToCart} ${addedToCart ? styles.added : ""}`}
                onClick={handleAddToCart}
                disabled={
                  !selectedSize ||
                  product.totalStock === 0 ||
                  availableStock === 0
                }
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    ¡Agregado!
                  </>
                ) : product.totalStock === 0 ? (
                  "Sin Stock"
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Agregar al Carrito
                  </>
                )}
              </button>

              {itemInCart && (
                <Link to="/checkout" className={styles.goToCheckout}>
                  Ir al checkout →
                </Link>
              )}
            </div>

            {/* Features */}
            <div className={styles.features}>
              <div className={styles.feature}>
                <Truck size={20} />
                <div>
                  <strong>Envío gratis</strong>
                  <span>En compras mayores a $50.000</span>
                </div>
              </div>
              <div className={styles.feature}>
                <RotateCcw size={20} />
                <div>
                  <strong>Devolución gratuita</strong>
                  <span>30 días para cambios</span>
                </div>
              </div>
              <div className={styles.feature}>
                <Shield size={20} />
                <div>
                  <strong>Garantía oficial</strong>
                  <span>Producto 100% original</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
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

          {product.images.length > 1 && (
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
            src={product.images[mainImageIndex]}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
          />

          <div className={styles.zoomCounter}>
            {mainImageIndex + 1} / {product.images.length}
          </div>
        </div>
      )}

      {/* Share Dialog */}
      <DialogConfirm
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onConfirm={copyToClipboard}
        title="Compartir producto"
        description="¿Querés copiar el link de este producto?"
        confirmText="Copiar link"
        cancelText="Cancelar"
        variant="info"
      />
    </div>
  );
}
