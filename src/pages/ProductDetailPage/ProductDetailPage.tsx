import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Share2, ShoppingBag, Check } from "lucide-react";
import { useProduct } from "@/hooks";
import { useCartStore } from "@/store";
import { ShoeSize } from "@/types";
import {
  toast,
  DialogConfirm,
  ImageGallery,
  SizeSelector,
  QuantitySelector,
  ProductFeatures,
  ProductTags,
  ProductRating,
  Breadcrumb,
} from "@/components";
import styles from "./ProductDetailPage.module.css";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(id || "");
  const { addItem, isInCart, getItemQuantity } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<ShoeSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Reset states when product changes
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
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

  const handleSizeSelect = (size: ShoeSize) => {
    setSelectedSize(size);
    setQuantity(1);
  };

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

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Mirá estas ${product.name} en BaireSnakers!`,
          url: window.location.href,
        });
      } catch {
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

  // Loading state
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

  // Error state
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
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Sneakers", href: "/sneakers" },
            { label: product.brand },
          ]}
        />

        <div className={styles.content}>
          {/* Gallery Section */}
          <ImageGallery
            images={product.images}
            productName={product.name}
            isFeatured={product.isFeatured}
          />

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

            {/* Rating */}
            <ProductRating />

            <p className={styles.description}>{product.description}</p>

            {/* Size Selection */}
            <SizeSelector
              stock={product.stock}
              selectedSize={selectedSize}
              onSelectSize={handleSizeSelect}
              cartQuantity={cartQuantity}
            />

            {/* Quantity */}
            <QuantitySelector
              quantity={quantity}
              maxQuantity={availableStock}
              onQuantityChange={handleQuantityChange}
            />

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
            <ProductFeatures />

            {/* Tags */}
            <ProductTags tags={product.tags || []} />
          </div>
        </div>
      </div>

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
