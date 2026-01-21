import { useState } from "react";
import { X, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/store";
import { ConfirmDialog } from "../Modal";
import { toast } from "../Toast";
import { ShoeSize } from "@/types";
import styles from "./Cart.module.css";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = useCartSubtotal();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
    toast.success("Carrito vaciado");
  };

  const handleRemoveItem = (
    productId: string,
    size: ShoeSize,
    name: string,
  ) => {
    removeItem(productId, size);
    toast.success(`${name} eliminado del carrito`);
  };

  const handleCheckout = () => {
    onClose();
    window.location.href = "/checkout";
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <aside className={styles.cart} onClick={(e) => e.stopPropagation()}>
          <header className={styles.header}>
            <h2>Tu Carrito</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </header>

          {items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag
                size={48}
                strokeWidth={1}
                className={styles.emptyIcon}
              />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <ul className={styles.items}>
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}`}
                    className={styles.item}
                  >
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemDetails}>
                      <h4>{item.product.name}</h4>
                      <p className={styles.itemMeta}>
                        {item.product.brand} • Talla {item.size}
                      </p>
                      <p className={styles.itemPrice}>
                        {formatPrice(item.product.price)}
                      </p>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() =>
                        handleRemoveItem(
                          item.productId,
                          item.size,
                          item.product.name,
                        )
                      }
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>

              <footer className={styles.footer}>
                <div className={styles.subtotal}>
                  <span>Subtotal</span>
                  <span className={styles.subtotalAmount}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <button
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                >
                  Ir al Checkout
                </button>
                <button
                  className={styles.clearButton}
                  onClick={() => setShowClearConfirm(true)}
                >
                  Vaciar Carrito
                </button>
              </footer>
            </>
          )}
        </aside>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCart}
        title="Vaciar Carrito"
        message="¿Estás seguro de que quieres eliminar todos los productos del carrito?"
        confirmText="Sí, vaciar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}
