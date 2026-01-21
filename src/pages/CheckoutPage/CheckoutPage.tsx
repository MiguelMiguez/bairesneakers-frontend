// ===========================================
// PAGES - CHECKOUT PAGE
// ===========================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore, useCartSubtotal, useAuthStore } from "@/store";
import { useCheckout } from "@/hooks";
import styles from "./CheckoutPage.module.css";

interface ShippingForm {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const subtotal = useCartSubtotal();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder, createPaymentPreference, isLoading, error } =
    useCheckout();

  const [shipping, setShipping] = useState<ShippingForm>({
    street: "",
    number: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
    }));

    const order = await createOrder({
      items: orderItems,
      shippingAddress: {
        street: shipping.street,
        number: shipping.number,
        city: shipping.city,
        state: shipping.state,
        country: "Argentina",
        zipCode: shipping.zipCode,
        isDefault: false,
      },
      shippingMethod: "standard",
    });

    if (order?.id) {
      const preference = await createPaymentPreference(order.id);
      if (preference?.initPoint) {
        clearCart();
        window.location.href = preference.initPoint;
      }
    }
  };

  const isFormValid =
    shipping.street &&
    shipping.number &&
    shipping.city &&
    shipping.state &&
    shipping.zipCode &&
    shipping.phone;

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos antes de continuar al checkout</p>
            <button onClick={() => navigate("/sneakers")}>Ver Productos</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.content}>
          {/* Shipping Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Información de Envío</h2>

            {!isAuthenticated && (
              <div className={styles.loginNotice}>
                <p>Debes iniciar sesión para completar tu compra</p>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/login", { state: { from: "/checkout" } })
                  }
                >
                  Iniciar Sesión
                </button>
              </div>
            )}

            {isAuthenticated && user && (
              <div className={styles.userInfo}>
                <p>
                  Comprando como: <strong>{user.email}</strong>
                </p>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="street">Calle</label>
              <input
                type="text"
                id="street"
                name="street"
                value={shipping.street}
                onChange={handleInputChange}
                placeholder="Nombre de la calle"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="number">Número</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={shipping.number}
                  onChange={handleInputChange}
                  placeholder="Número"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="city">Ciudad</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shipping.city}
                  onChange={handleInputChange}
                  placeholder="Ciudad"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="state">Provincia</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shipping.state}
                  onChange={handleInputChange}
                  placeholder="Provincia"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="zipCode">Código Postal</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shipping.zipCode}
                  onChange={handleInputChange}
                  placeholder="C.P."
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shipping.phone}
                onChange={handleInputChange}
                placeholder="Tu número de teléfono"
                required
              />
            </div>

            {error && <div className={styles.error}>{error.message}</div>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid || isLoading || !isAuthenticated}
            >
              {isLoading ? "Procesando..." : "Pagar con Mercado Pago"}
            </button>
          </form>

          {/* Order Summary */}
          <aside className={styles.summary}>
            <h2>Resumen del Pedido</h2>

            <div className={styles.items}>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className={styles.item}
                >
                  <img src={item.product.thumbnail} alt={item.product.name} />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.product.name}</p>
                    <p className={styles.itemDetails}>
                      Talle: {item.size} · Cant: {item.quantity}
                    </p>
                    <p className={styles.itemPrice}>
                      $
                      {(item.product.price * item.quantity).toLocaleString(
                        "es-AR",
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString("es-AR")}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Envío</span>
                <span>{subtotal >= 50000 ? "Gratis" : "$5.000"}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.final}`}>
                <span>Total</span>
                <span>
                  $
                  {(subtotal + (subtotal >= 50000 ? 0 : 5000)).toLocaleString(
                    "es-AR",
                  )}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
