import { Address } from "./user.types";
import { Product, ShoeSize } from "./product.types";

export type OrderStatus =
  | "pending"
  | "approved"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface OrderItem {
  productId: string;
  productSnapshot: {
    name: string;
    model: string;
    brand: string;
    thumbnail: string;
    sku: string;
  };
  size: ShoeSize;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  payment: {
    status: PaymentStatus;
    mercadoPagoId?: string;
    preferenceId?: string;
  };
  shipping: {
    address: Address;
    method: string;
    trackingNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  size: ShoeSize;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface CreateOrderDTO {
  items: Array<{
    productId: string;
    size: ShoeSize;
    quantity: number;
  }>;
  shippingAddress: Omit<Address, "id">;
  shippingMethod: string;
}

export interface MercadoPagoPreference {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}
