// ===========================================
// STORE - CART STORE (ZUSTAND)
// ===========================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product, ShoeSize } from "@/types";

interface CartState {
  items: CartItem[];

  // Actions
  addItem: (product: Product, size: ShoeSize, quantity?: number) => void;
  removeItem: (productId: string, size: ShoeSize) => void;
  updateQuantity: (productId: string, size: ShoeSize, quantity: number) => void;
  clearCart: () => void;

  // Helpers
  getItemQuantity: (productId: string, size: ShoeSize) => number;
  isInCart: (productId: string, size: ShoeSize) => boolean;
}

/**
 * Store del carrito usando Zustand con persistencia en localStorage
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, size: ShoeSize, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.id && item.size === size,
          );

          if (existingIndex >= 0) {
            // Item exists, update quantity
            const newItems = [...state.items];
            const existingItem = newItems[existingIndex];
            if (existingItem) {
              existingItem.quantity += quantity;
            }
            return { items: newItems };
          }

          // New item
          const newItem: CartItem = {
            productId: product.id,
            product,
            size,
            quantity,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId: string, size: ShoeSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size),
          ),
        }));
      },

      updateQuantity: (productId: string, size: ShoeSize, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity }
              : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemQuantity: (productId: string, size: ShoeSize) => {
        const item = get().items.find(
          (i) => i.productId === productId && i.size === size,
        );
        return item?.quantity ?? 0;
      },

      isInCart: (productId: string, size: ShoeSize) => {
        return get().items.some(
          (item) => item.productId === productId && item.size === size,
        );
      },
    }),
    {
      name: "sneaker-solid-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/**
 * Hook selector para obtener el conteo de items
 */
export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

/**
 * Hook selector para obtener el subtotal
 */
export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.items.reduce(
      (total, item) => total + (item.product?.price ?? 0) * item.quantity,
      0,
    ),
  );
