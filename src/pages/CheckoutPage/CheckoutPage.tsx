import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { useCartStore, useCartSubtotal, useAuthStore } from "@/store";
import { useCheckout, useForm } from "@/hooks";
import { Form, FormSectionConfig, commonFields } from "@/components/Form";
import styles from "./CheckoutPage.module.css";

interface ShippingFormValues {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

const INITIAL_VALUES: ShippingFormValues = {
  street: "",
  number: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
};

const SHIPPING_FORM_SECTIONS: FormSectionConfig[] = [
  {
    fields: [
      commonFields.street({
        label: "Calle",
        placeholder: "Nombre de la calle",
      }),
    ],
  },
  {
    columns: 2,
    fields: [
      {
        name: "number",
        label: "Número",
        type: "text",
        placeholder: "Número",
        required: true,
        autoComplete: "address-line2",
      },
      commonFields.city(),
    ],
  },
  {
    columns: 2,
    fields: [
      commonFields.state({ label: "Provincia", placeholder: "Provincia" }),
      commonFields.zipCode({ label: "Código Postal", placeholder: "C.P." }),
    ],
  },
  {
    fields: [commonFields.phone()],
  },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const subtotal = useCartSubtotal();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder, createPaymentPreference, isLoading, error } =
    useCheckout();

  const {
    values: shipping,
    handleChange,
    handleSubmit,
  } = useForm<ShippingFormValues>({
    initialValues: INITIAL_VALUES,
    onSubmit: async (values) => {
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
          street: values.street,
          number: values.number,
          city: values.city,
          state: values.state,
          country: "Argentina",
          zipCode: values.zipCode,
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
    },
  });

  const isFormValid = Boolean(
    shipping.street &&
    shipping.number &&
    shipping.city &&
    shipping.state &&
    shipping.zipCode &&
    shipping.phone,
  );

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
          <div className={styles.formWrapper}>
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

            <Form
              sections={SHIPPING_FORM_SECTIONS}
              values={shipping}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitLabel="Pagar con Mercado Pago"
              submitIcon={<CreditCard size={18} />}
              isLoading={isLoading}
              isValid={isFormValid && Boolean(isAuthenticated)}
              className={styles.form}
            />

            {error && <div className={styles.error}>{error.message}</div>}
          </div>

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
